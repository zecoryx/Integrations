import { serverEnv } from '../../../env';
import { ErrorStatusCode } from './constants/error-status-codes';
import { ResponseStatus } from './constants/response-status';
import { CheckTransactionStatusDto } from './dto/check-status.dto';
import { CheckTransactionDto } from './dto/check-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { TransactionRepository } from '../../../repositories/transaction.repository';
import { UserRepository } from '../../../repositories/user.repository';
import { PlanRepository } from '../../../repositories/plan.repository';
import { PaymentStatus, PaymentProvider } from '../../../constants/payment.constants';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UzumService {
  private readonly myServiceId: number;
  private transactionRepo = new TransactionRepository();
  private userRepo = new UserRepository();
  private planRepo = new PlanRepository();

  constructor() {
    this.myServiceId = serverEnv.UZUM_SERVICE_ID;
    if (!this.myServiceId) {
      throw new Error('UZUM_SERVICE_ID is not configured.');
    }
  }

  async check(dto: CheckTransactionDto) {
    this._validateServiceId(dto.serviceId);
    await this._getPlan(dto.params.planId);

    return {
      serviceId: dto.serviceId,
      timestamp: new Date().toISOString(),
      status: ResponseStatus.Ok,
      data: { account: { value: dto.params.planId } },
    };
  }

  async create(dto: CreateTransactionDto) {
    return prisma.$transaction(async (prismaTx) => {
      this._validateServiceId(dto.serviceId);

      const existingTx = await this.transactionRepo.findByTransId(dto.transId, prismaTx);
      if (existingTx) {
        throw this._createErrorResponse(dto.serviceId, ErrorStatusCode.ErrorCheckingPaymentData, 'Transaction already exists');
      }

      const [plan, user] = await Promise.all([
        this._getPlan(dto.params.planId),
        this._getUser(dto.params.userId)
      ]);

      if (plan.price * 100 !== dto.amount) {
        throw this._createErrorResponse(dto.serviceId, ErrorStatusCode.ErrorCheckingPaymentData, 'Invalid amount');
      }

      await this.transactionRepo.create({
        transId: dto.transId,
        amount: dto.amount,
        user: { connect: { id: user.id } },
        status: PaymentStatus.PENDING,
        provider: PaymentProvider.UZUM,
        plan: { connect: { id: plan.id } },
      }, prismaTx);

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
    return prisma.$transaction(async (prismaTx) => {
      this._validateServiceId(dto.serviceId);
      const tx = await this._getTransaction(dto.transId, prismaTx);

      if (tx.status !== PaymentStatus.PENDING) {
        throw this._createErrorResponse(dto.serviceId, ErrorStatusCode.PaymentAlreadyProcessed, 'Already processed', dto.transId);
      }

      await this.transactionRepo.updateByTransId(dto.transId, {
        performTime: new Date(),
        status: PaymentStatus.PAID,
      }, prismaTx);

      return {
        serviceId: dto.serviceId,
        transId: dto.transId,
        status: ResponseStatus.Confirmed,
        confirmTime: new Date().toISOString(),
      };
    });
  }

  async reverse(dto: ReverseTransactionDto) {
    return prisma.$transaction(async (prismaTx) => {
      this._validateServiceId(dto.serviceId);
      const tx = await this._getTransaction(dto.transId, prismaTx);

      await this.transactionRepo.updateByTransId(dto.transId, {
        cancelTime: new Date(),
        status: PaymentStatus.CANCELED,
      }, prismaTx);

      return {
        serviceId: dto.serviceId,
        transId: dto.transId,
        status: ResponseStatus.Reversed,
        reverseTime: new Date().toISOString(),
        amount: tx.amount,
      };
    });
  }

  async status(dto: CheckTransactionStatusDto) {
    this._validateServiceId(dto.serviceId);
    const tx = await this._getTransaction(dto.transId);
    return {
      serviceId: dto.serviceId,
      transId: dto.transId,
      status: tx.status,
    };
  }

  private _validateServiceId(serviceId: number) {
    if (serviceId !== this.myServiceId) {
      throw this._createErrorResponse(serviceId, ErrorStatusCode.InvalidServiceId, 'Invalid serviceId');
    }
  }

  private async _getPlan(planId: string) {
    if (!planId || planId.trim() === '') throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, 'Invalid planId');
    const plan = await this.planRepo.findById(planId);
    if (!plan) throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, 'Plan not found');
    return plan;
  }
  
  private async _getUser(userId: string) {
      if (!userId || userId.trim() === '') throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, 'Invalid userId');
      const user = await this.userRepo.findById(userId);
      if (!user) throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.ErrorCheckingPaymentData, 'User not found');
      return user;
  }

  private async _getTransaction(transId: string, prismaTx?: any) {
    const tx = await this.transactionRepo.findByTransId(transId, prismaTx);
    if (!tx) throw this._createErrorResponse(this.myServiceId, ErrorStatusCode.AdditionalPaymentPropertyNotFound, 'Tx not found', transId);
    return tx;
  }

  private _createErrorResponse(serviceId: number, errorCode: ErrorStatusCode, errorMessage: string, transId?: string) {
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
