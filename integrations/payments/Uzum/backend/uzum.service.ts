// @ts-nocheck

import { Prisma, PrismaClient } from '@prisma/client';
import { executeTransaction } from '../../../../utils/transaction';
import { ErrorStatusCode } from './constants/error-status-codes';
import { ResponseStatus } from './constants/response-status';
import { CheckTransactionStatusDto } from './dto/check-status.dto';
import { CheckTransactionDto } from './dto/check-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';

const prisma = new PrismaClient();

export class UzumService {
  private readonly myServiceId: number;

  constructor() {
    this.myServiceId = Number(process.env.UZUM_SERVICE_ID);
    if (!this.myServiceId) {
      throw new Error('UZUM_SERVICE_ID is not configured in environment variables.');
    }
  }

  async check(dto: CheckTransactionDto) {
    this._validateServiceId(dto.serviceId);
    await this._getPlan(dto.params.planId);

    return {
      serviceId: dto.serviceId,
      timestamp: new Date().toISOString(),
      status: ResponseStatus.Ok,
      data: {
        account: {
          value: dto.params.planId,
        },
      },
    };
  }

  async create(dto: CreateTransactionDto) {
    return executeTransaction(async (prisma) => {
      this._validateServiceId(dto.serviceId);

      const existingTransaction = await prisma.transactions.findUnique({
        where: { transId: dto.transId },
      });

      if (existingTransaction) {
        console.error(`Transaction with transId ${dto.transId} already exists.`);
        throw this._createErrorResponse(
            dto.serviceId,
            ErrorStatusCode.ErrorCheckingPaymentData, // Or a more specific error code if available
            `Transaction with transId ${dto.transId} already exists.`
          );
      }

      const plan = await this._getPlan(dto.params.planId, prisma);
      const user = await this._getUser(dto.params.userId, prisma);

      if (plan.price * 100 !== dto.amount) {
        const errorMsg = `Invalid amount for plan ${plan.id}. Expected ${plan.price * 100}, got ${dto.amount}`;
        console.error(errorMsg);
        throw this._createErrorResponse(
          dto.serviceId,
          ErrorStatusCode.ErrorCheckingPaymentData,
          errorMsg
        );
      }

      await prisma.transactions.create({
        data: {
          transId: dto.transId,
          amount: dto.amount,
          user: { connect: { id: user.id } },
          status: 'PENDING',
          provider: 'uzum',
          plan: { connect: { id: plan.id } },
        },
      });

      return {
        serviceId: dto.serviceId,
        timestamp: new Date().toISOString(),
        status: ResponseStatus.Created,
        transTime: new Date().toISOString(),
        transId: dto.transId,
        amount: dto.amount,
      };
    });
  }

  async confirm(dto: ConfirmTransactionDto) {
    return executeTransaction(async (prisma) => {
      this._validateServiceId(dto.serviceId);
      const transaction = await this._getTransaction(dto.transId, prisma);

      if (transaction.status !== 'PENDING') {
        const errorMsg = `Attempted to confirm an already processed transaction: ${dto.transId}`;
        console.error(errorMsg);
        throw this._createErrorResponse(
          dto.serviceId,
          ErrorStatusCode.PaymentAlreadyProcessed,
          errorMsg,
          dto.transId,
        );
      }

      // TODO: Implement your payment processing logic here

      await prisma.transactions.update({
        where: { transId: dto.transId },
        data: {
          performTime: new Date(),
          status: 'PAID',
        },
      });

      return {
        serviceId: dto.serviceId,
        transId: dto.transId,
        status: ResponseStatus.Confirmed,
        confirmTime: new Date().toISOString(),
      };
    });
  }

  async reverse(dto: ReverseTransactionDto) {
    return executeTransaction(async (prisma) => {
      this._validateServiceId(dto.serviceId);
      const transaction = await this._getTransaction(dto.transId, prisma);

      await prisma.transactions.update({
        where: { transId: dto.transId },
        data: {
          cancelTime: new Date(),
          status: 'CANCELED',
        },
      });

      return {
        serviceId: dto.serviceId,
        transId: dto.transId,
        status: ResponseStatus.Reversed,
        reverseTime: new Date().toISOString(),
        amount: transaction.amount,
      };
    });
  }

  async status(dto: CheckTransactionStatusDto) {
    this._validateServiceId(dto.serviceId);
    const transaction = await this._getTransaction(dto.transId);
    return {
      serviceId: dto.serviceId,
      transId: dto.transId,
      status: transaction.status,
    };
  }

  private _validateServiceId(serviceId: number) {
    if (serviceId !== this.myServiceId) {
      const errorMsg = `Invalid serviceId. Expected ${this.myServiceId}, but got ${serviceId}`;
      console.error(errorMsg);
      throw this._createErrorResponse(
        serviceId,
        ErrorStatusCode.InvalidServiceId,
        errorMsg
      );
    }
  }

  private async _getPlan(planId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    if (!planId || planId.trim() === '') {
      const errorMsg = `Invalid planId format: ${planId}`;
      console.error(errorMsg);
      throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, errorMsg);
    }
    const plan = await prismaInstance.plans.findUnique({ where: { id: planId } });
    if (!plan) {
      const errorMsg = `Plan not found: ${planId}`;
      console.error(errorMsg);
      throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, errorMsg);
    }
    return plan;
  }
  
  private async _getUser(userId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
      if (!userId || userId.trim() === '') {
          const errorMsg = `Invalid userId format: ${userId}`;
          console.error(errorMsg);
          throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, errorMsg);
      }
      const user = await prismaInstance.users.findUnique({ where: { id: userId } });
      if (!user) {
          const errorMsg = `User not found: ${userId}`;
          console.error(errorMsg);
          throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, errorMsg);
      }
      return user;
  }

  private async _getTransaction(transId: string, prismaInstance: Prisma.TransactionClient | PrismaClient = prisma) {
    const transaction = await prismaInstance.transactions.findUnique({
      where: { transId },
    });
    if (!transaction) {
      const errorMsg = `Transaction not found: ${transId}`;
      console.error(errorMsg);
      throw this._createErrorResponse(
        this.myServiceId,
        ErrorStatusCode.AdditionalPaymentPropertyNotFound,
        errorMsg,
        transId,
      );
    }
    return transaction;
  }

  private _createErrorResponse(
    serviceId: number,
    errorCode: ErrorStatusCode,
    errorMessage: string,
    transId?: string,
  ) {
    return {
      serviceId,
      timestamp: new Date().toISOString(),
      status: ResponseStatus.Failed,
      errorCode,
      errorMessage,
      ...(transId && { transId }),
    };
  }
}
