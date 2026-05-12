import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
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
import { TransactionRepository } from '../../../repositories/transaction.repository';
import { UserRepository } from '../../../repositories/user.repository';
import { PlanRepository } from '../../../repositories/plan.repository';
import { PaymentStatus, PaymentProvider } from '../../../constants/payment.constants';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TRANSACTION_TIMEOUT_MINUTES = 720;

export class PaymeService {
  private transactionRepo = new TransactionRepository();
  private userRepo = new UserRepository();
  private planRepo = new PlanRepository();

  async handleTransactionMethods(reqBody: RequestBody) {
    switch (reqBody.method) {
      case TransactionMethods.CheckPerformTransaction:
        return this.checkPerformTransaction(reqBody as CheckPerformTransactionDto);
      case TransactionMethods.CreateTransaction:
        return this.createTransaction(reqBody as CreateTransactionDto);
      case TransactionMethods.CheckTransaction:
        return this.checkTransaction(reqBody as CheckTransactionDto);
      case TransactionMethods.PerformTransaction:
        return this.performTransaction(reqBody as PerformTransactionDto);
      case TransactionMethods.CancelTransaction:
        return this.cancelTransaction(reqBody as CancelTransactionDto);
      case TransactionMethods.GetStatement:
        return this.getStatement(reqBody as GetStatementDto);
      default:
        return this._createError(PaymeError.InvalidAuthorization, undefined, 'Invalid method');
    }
  }

  async checkPerformTransaction(dto: CheckPerformTransactionDto) {
    const { amount, account } = dto.params;
    const { plan } = await this._findUserAndPlan(account.user_id, account.planId);

    if (plan.price * 100 !== amount) {
      return this._createError(PaymeError.InvalidAmount);
    }

    return { result: { allow: true } };
  }

  async createTransaction(dto: CreateTransactionDto) {
    return prisma.$transaction(async (prismaTx) => {
      const { id: transId, amount, account } = dto.params;
      const existingTx = await this.transactionRepo.findByTransId(transId, prismaTx);

      if (existingTx) {
        return this._handleExistingTransaction(existingTx, prismaTx);
      }

      const { user, plan } = await this._findUserAndPlan(account.user_id, account.planId, prismaTx);

      if (plan.price * 100 !== amount) {
        return this._createError(PaymeError.InvalidAmount, transId);
      }

      const newTx = await this.transactionRepo.create({
        transId,
        user: { connect: { id: user.id } },
        plan: { connect: { id: plan.id } },
        provider: PaymentProvider.PAYME,
        state: TransactionState.Pending,
        status: PaymentStatus.PENDING,
        amount,
      }, prismaTx);

      return {
        result: {
          transaction: newTx.id,
          state: TransactionState.Pending,
          create_time: new Date(newTx.createdAt).getTime(),
        },
      };
    });
  }

  private async _handleExistingTransaction(tx: any, prismaTx: any) {
    if (tx.status !== PaymentStatus.PENDING) {
      return this._createError(PaymeError.CantDoOperation, tx.transId);
    }
    const expiryError = await this._checkAndHandleExpiry(tx, prismaTx);
    if (expiryError) return expiryError;

    return {
      result: {
        transaction: tx.id,
        state: TransactionState.Pending,
        create_time: new Date(tx.createdAt).getTime(),
      },
    };
  }

  async performTransaction(dto: PerformTransactionDto) {
    return prisma.$transaction(async (prismaTx) => {
      const transId = dto.params.id;
      const tx = await this.transactionRepo.findByTransId(transId, prismaTx);
      if (!tx) return this._createError(PaymeError.TransactionNotFound, transId);

      if (tx.status !== PaymentStatus.PENDING) {
        return this._handleAlreadyPerformed(tx);
      }

      const expiryError = await this._checkAndHandleExpiry(tx, prismaTx);
      if (expiryError) return expiryError;

      const performTime = new Date();
      await this.transactionRepo.update(tx.id, {
        status: PaymentStatus.PAID,
        state: TransactionState.Paid,
        performTime,
      }, prismaTx);

      return {
        result: {
          transaction: tx.id,
          perform_time: performTime.getTime(),
          state: TransactionState.Paid,
        },
      };
    });
  }

  private _handleAlreadyPerformed(tx: any) {
    if (tx.status === PaymentStatus.PAID) {
      return {
        result: {
          state: tx.state,
          transaction: tx.id,
          perform_time: new Date(tx.performTime).getTime(),
        },
      };
    }
    return this._createError(PaymeError.CantDoOperation, tx.transId);
  }

  async cancelTransaction(dto: CancelTransactionDto) {
    return prisma.$transaction(async (prismaTx) => {
      const { id: transId, reason } = dto.params;
      const tx = await this.transactionRepo.findByTransId(transId, prismaTx);
      if (!tx) return this._createError(PaymeError.TransactionNotFound, transId);

      let newState: number;
      if (tx.status === PaymentStatus.PENDING) {
        newState = TransactionState.PendingCanceled;
      } else if (tx.status === PaymentStatus.PAID) {
        newState = TransactionState.PaidCanceled;
      } else {
        return this._getCancelResult(tx);
      }

      const updatedTx = await this.transactionRepo.update(tx.id, {
        status: PaymentStatus.CANCELED,
        state: newState,
        cancelTime: new Date(),
        reason: reason,
      }, prismaTx);

      return this._getCancelResult(updatedTx);
    });
  }

  private _getCancelResult(tx: any) {
    return {
      result: {
        cancel_time: new Date(tx.cancelTime).getTime(),
        transaction: tx.id,
        state: tx.state,
      },
    };
  }

  async checkTransaction(dto: CheckTransactionDto) {
    const tx = await this.transactionRepo.findByTransId(dto.params.id);
    if (!tx) return this._createError(PaymeError.TransactionNotFound, dto.params.id);

    return {
      result: {
        create_time: new Date(tx.createdAt).getTime(),
        perform_time: tx.performTime ? new Date(tx.performTime).getTime() : 0,
        cancel_time: tx.cancelTime ? new Date(tx.cancelTime).getTime() : 0,
        transaction: tx.id,
        state: tx.state,
        reason: tx.reason,
      },
    };
  }

  async getStatement(dto: GetStatementDto) {
    const transactions = await this.transactionRepo.findMany({
      createdAt: {
        gte: new Date(dto.params.from),
        lte: new Date(dto.params.to),
      },
      provider: PaymentProvider.PAYME,
    });

    return {
      result: {
        transactions: transactions.map((t: any) => ({
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

  private async _findUserAndPlan(userId: string, planId: string, prismaInstance?: any) {
    const [user, plan] = await Promise.all([
      this.userRepo.findById(userId),
      this.planRepo.findById(planId)
    ]);

    if (!user) throw this._createError(PaymeError.UserNotFound);
    if (!plan) throw this._createError(PaymeError.ProductNotFound);

    return { user, plan };
  }

  private async _checkAndHandleExpiry(tx: any, prismaTx: any) {
    const isExpired = DateTime.fromJSDate(tx.createdAt).plus({ minutes: TRANSACTION_TIMEOUT_MINUTES }) < DateTime.now();

    if (isExpired) {
      await this.transactionRepo.update(tx.id, {
        status: PaymentStatus.CANCELED,
        state: TransactionState.PendingCanceled,
        cancelTime: new Date(),
        reason: CancelingReasons.CanceledDueToTimeout,
      }, prismaTx);
      return this._createError(PaymeError.CantDoOperation, tx.transId, 'Transaction timed out');
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
