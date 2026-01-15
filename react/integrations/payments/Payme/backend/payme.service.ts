import { Prisma, PrismaClient, Transactions } from '@prisma/client';
import { DateTime } from 'luxon';
import { executeTransaction } from '../../../utils/transaction';
import { CancelingReasons } from './constants/canceling-reasons';
import { ErrorStatusCodes } from './constants/error-status-codes';
import { PaymeError } from './constants/payme-error';
import { TransactionMethods } from './constants/transaction-methods';
import { TransactionState } from './constants/transaction-state';
import { CancelTransactionDto } from './dto/cancel-transaction.dto';
import { CheckPerformTransactionDto } from './dto/check-perform-transaction.dto';
import { CheckTransactionDto } from './dto/check-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetStatementDto } from './dto/get-statement.dto';
import { PerformTransactionDto } from './dto/perform-transaction.dto';
import { RequestBody } from './types/incoming-request-body';

const TRANSACTION_TIMEOUT_MINUTES = 720; // 12 hours
const prisma = new PrismaClient();

export class PaymeService {

  async handleTransactionMethods(reqBody: RequestBody) {
    switch (reqBody.method) {
      case TransactionMethods.CheckPerformTransaction:
        return this.checkPerformTransaction(reqBody);
      case TransactionMethods.CreateTransaction:
        return this.createTransaction(reqBody);
      case TransactionMethods.CheckTransaction:
        return this.checkTransaction(reqBody);
      case TransactionMethods.PerformTransaction:
        return this.performTransaction(reqBody);
      case TransactionMethods.CancelTransaction:
        return this.cancelTransaction(reqBody);
      case TransactionMethods.GetStatement:
        return this.getStatement(reqBody);
      default:
        return this._createError(PaymeError.InvalidAuthorization, null, 'Invalid method');
    }
  }

  async checkPerformTransaction(dto: CheckPerformTransactionDto) {
    const { amount, account } = dto.params;
    const { user, plan } = await this._findUserAndPlan(account.user_id, account.planId);

    // Payme amounts are in tiyns (cents)
    if (plan.price * 100 !== amount) {
      console.error(`Invalid amount for plan ${plan.id}. Expected ${plan.price * 100}, got ${amount}`);
      return this._createError(PaymeError.InvalidAmount);
    }

    return { result: { allow: true } };
  }

  async createTransaction(dto: CreateTransactionDto) {
    return executeTransaction(async (prisma) => {
      const { id: transId, amount, account } = dto.params;

      const existingTransaction = await prisma.transactions.findUnique({ where: { transId } });

      if (existingTransaction) {
        if (existingTransaction.status !== 'PENDING') {
          return this._createError(PaymeError.CantDoOperation, transId);
        }
        const expiryError = await this._checkAndHandleExpiry(existingTransaction, prisma);
        if (expiryError) {
          return expiryError;
        }
        return {
          result: {
            transaction: existingTransaction.id,
            state: TransactionState.Pending,
            create_time: new Date(existingTransaction.createdAt).getTime(),
          },
        };
      }

      const { user, plan } = await this._findUserAndPlan(account.user_id, account.planId, prisma);

      if (plan.price * 100 !== amount) {
        console.error(`Invalid amount for plan ${plan.id}. Expected ${plan.price * 100}, got ${amount}`);
        return this._createError(PaymeError.InvalidAmount, transId);
      }

      const newTransaction = await prisma.transactions.create({
        data: {
          transId,
          user: { connect: { id: user.id } },
          plan: { connect: { id: plan.id } },
          provider: 'payme',
          state: TransactionState.Pending,
          status: 'PENDING',
          amount,
        },
      });

      return {
        result: {
          transaction: newTransaction.id,
          state: TransactionState.Pending,
          create_time: new Date(newTransaction.createdAt).getTime(),
        },
      };
    });
  }

  async performTransaction(dto: PerformTransactionDto) {
    return executeTransaction(async (prisma) => {
      const transId = dto.params.id;
      const transaction = await this._findTransaction(transId, prisma);

      if (transaction.status !== 'PENDING') {
        if (transaction.status === 'PAID') {
          return {
            result: {
              state: transaction.state,
              transaction: transaction.id,
              perform_time: new Date(transaction.performTime).getTime(),
            },
          };
        }
        return this._createError(PaymeError.CantDoOperation, transId);
      }

      const expiryError = await this._checkAndHandleExpiry(transaction, prisma);
      if (expiryError) {
        return expiryError;
      }

      const performTime = new Date();
      const updatedPayment = await prisma.transactions.update({
        where: { id: transaction.id },
        data: {
          status: 'PAID',
          state: TransactionState.Paid,
          performTime,
        },
      });

      return {
        result: {
          transaction: updatedPayment.id,
          perform_time: performTime.getTime(),
          state: TransactionState.Paid,
        },
      };
    });
  }

  async cancelTransaction(dto: CancelTransactionDto) {
    return executeTransaction(async (prisma) => {
      const { id: transId, reason } = dto.params;
      const transaction = await this._findTransaction(transId, prisma);

      let newState: TransactionState;
      if (transaction.status === 'PENDING') {
        newState = TransactionState.PendingCanceled;
      } else if (transaction.status === 'PAID') {
        newState = TransactionState.PaidCanceled;
      } else {
        return {
          result: {
            state: transaction.state,
            transaction: transaction.id,
            cancel_time: new Date(transaction.cancelTime).getTime(),
          },
        };
      }

      const updatedTransaction = await prisma.transactions.update({
        where: { id: transaction.id },
        data: {
          status: 'CANCELED',
          state: newState,
          cancelTime: new Date(),
          reason: reason,
        },
      });

      return {
        result: {
          cancel_time: new Date(updatedTransaction.cancelTime).getTime(),
          transaction: updatedTransaction.id,
          state: newState,
        },
      };
    });
  }

  async checkTransaction(dto: CheckTransactionDto) {
    const transaction = await this._findTransaction(dto.params.id);
    return {
      result: {
        create_time: new Date(transaction.createdAt).getTime(),
        perform_time: transaction.performTime ? new Date(transaction.performTime).getTime() : 0,
        cancel_time: transaction.cancelTime ? new Date(transaction.cancelTime).getTime() : 0,
        transaction: transaction.id,
        state: transaction.state,
        reason: transaction.reason,
      },
    };
  }

  async getStatement(dto: GetStatementDto) {
    const transactions = await prisma.transactions.findMany({
      where: {
        createdAt: {
          gte: new Date(dto.params.from),
          lte: new Date(dto.params.to),
        },
        provider: 'payme',
      },
    });

    return {
      result: {
        transactions: transactions.map((t) => ({
          id: t.transId,
          time: new Date(t.createdAt).getTime(),
          amount: t.amount,
          account: { user_id: t.userId, planId: t.planId },
          create_time: new Date(t.createdAt).getTime(),
          perform_time: t.performTime ? new Date(t.performTime).getTime() : 0,
          cancel_time: t.cancelTime ? new Date(t.cancelTime).getTime() : 0,
          transaction: t.id,
          state: t.state,
          reason: t.reason || null,
        })),
      },
    };
  }

  private async _findUserAndPlan(userId: string, planId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    const user = await prismaInstance.users.findUnique({ where: { id: userId } });
    if (!user) {
      console.error(`User not found: ${userId}`);
      throw this._createError(PaymeError.UserNotFound);
    }

    const plan = await prismaInstance.plans.findUnique({ where: { id: planId } });
    if (!plan) {
      console.error(`Plan not found: ${planId}`);
      throw this._createError(PaymeError.ProductNotFound);
    }

    return { user, plan };
  }

  private async _findTransaction(transId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    const transaction = await prismaInstance.transactions.findUnique({ where: { transId } });
    if (!transaction) {
      console.error(`Transaction not found: ${transId}`);
      throw this._createError(PaymeError.TransactionNotFound, transId);
    }
    return transaction;
  }

  private async _checkAndHandleExpiry(transaction: Transactions, prismaInstance: Prisma.TransactionClient) {
    const isExpired = DateTime.fromJSDate(transaction.createdAt)
      .plus({ minutes: TRANSACTION_TIMEOUT_MINUTES }) < DateTime.now();

    if (isExpired) {
      console.warn(`Transaction ${transaction.transId} has expired.`);
      await prismaInstance.transactions.update({
        where: { id: transaction.id },
        data: {
          status: 'CANCELED',
          state: TransactionState.PendingCanceled,
          cancelTime: new Date(),
          reason: CancelingReasons.CanceledDueToTimeout,
        },
      });
      return this._createError(PaymeError.CantDoOperation, transaction.transId, 'Transaction timed out');
    }
    return null;
  }

  private _createError(error: any, id?: string, data?: string) {
    return {
      error: {
        code: error.code || ErrorStatusCodes.SystemError,
        message: error.message,
        data,
      },
      ...(id && { id }),
    };
  }
}
