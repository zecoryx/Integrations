import { serverEnv } from '../../../env';
import { generateMD5 } from '../../../utils/hashing';
import { ClickError } from './constants/status-codes';
import { TransactionActions } from './constants/transaction-actions';
import { ClickRequestDto } from './dto/click-request.dto';
import { GenerateMd5HashParams } from './interfaces/generate-prepare-hash.interface';
import { TransactionRepository } from '../../../repositories/transaction.repository';
import { UserRepository } from '../../../repositories/user.repository';
import { PlanRepository } from '../../../repositories/plan.repository';
import { PaymentStatus, PaymentProvider } from '../../../constants/payment.constants';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClickService {
  private readonly secretKey: string;
  private transactionRepo = new TransactionRepository();
  private userRepo = new UserRepository();
  private planRepo = new PlanRepository();

  constructor() {
    this.secretKey = serverEnv.CLICK_SECRET_KEY;
    if (!this.secretKey) {
      throw new Error('CLICK_SECRET_KEY is not configured.');
    }
  }

  public async handleMerchantTransactions(clickReqBody: ClickRequestDto) {
    const action = Number(clickReqBody.action);

    if (action === TransactionActions.Prepare) {
      return this.prepare(clickReqBody);
    } else if (action === TransactionActions.Complete) {
      return this.complete(clickReqBody);
    } else {
      return {
        error: ClickError.ActionNotFound,
        error_note: 'Invalid action',
      };
    }
  }

  private async prepare(dto: ClickRequestDto) {
    const {
      click_trans_id: clickTransId,
      service_id: serviceId,
      merchant_trans_id: planId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
      param2: userId,
    } = dto;

    const signatureError = this._validateSignature(
      { clickTransId: String(clickTransId), serviceId, secretKey: this.secretKey, merchantTransId: planId, amount, action, signTime },
      signString,
    );
    if (signatureError) return signatureError;

    const { user, plan, error } = await this._validateTransaction(userId || '', planId || '');
    if (error) return error;

    const existingTx = await this.transactionRepo.findFirst({
      userId: user.id,
      planId: plan.id,
      status: { in: [PaymentStatus.PAID, PaymentStatus.CANCELED] },
    });

    if (existingTx) {
      if (existingTx.status === PaymentStatus.PAID) return { error: ClickError.AlreadyPaid, error_note: 'Already paid' };
      if (existingTx.status === PaymentStatus.CANCELED) return { error: ClickError.TransactionCanceled, error_note: 'Transaction is canceled' };
    }

    if (Number(amount) !== plan.price) return { error: ClickError.InvalidAmount, error_note: 'Invalid amount' };

    const time = new Date().getTime();
    const newTx = await this.transactionRepo.create({
      plan: { connect: { id: plan.id } },
      user: { connect: { id: user.id } },
      transId: String(clickTransId),
      prepareId: time,
      status: PaymentStatus.PENDING,
      provider: PaymentProvider.CLICK,
      amount: Number(amount),
      createdAt: new Date(time),
    });

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: planId,
      merchant_prepare_id: newTx.prepareId,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  private async complete(dto: ClickRequestDto) {
    const {
      click_trans_id: clickTransId,
      service_id: serviceId,
      merchant_trans_id: planId,
      merchant_prepare_id: prepareId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
      param2: userId,
      error: clickError,
    } = dto;

    const signatureError = this._validateSignature(
      { clickTransId: String(clickTransId), serviceId, secretKey: this.secretKey, merchantTransId: planId, merchantPrepareId: prepareId, amount, action, signTime },
      signString,
    );
    if (signatureError) return signatureError;

    const { user, plan, error: validationError } = await this._validateTransaction(userId || '', planId || '');
    if (validationError) return validationError;

    const preparedTx = await this.transactionRepo.findFirst({
      prepareId: Number(prepareId),
      userId: user.id,
      planId: plan.id,
    });

    if (!preparedTx) return { error: ClickError.TransactionNotFound, error_note: 'Transaction not found' };
    if (preparedTx.status === PaymentStatus.PAID) return { error: ClickError.AlreadyPaid, error_note: 'Already paid' };
    if (preparedTx.status === PaymentStatus.CANCELED) return { error: ClickError.TransactionCanceled, error_note: 'Transaction already canceled' };
    if (Number(amount) !== plan.price) return { error: ClickError.InvalidAmount, error_note: 'Invalid amount' };

    if (clickError !== 0) {
      await this.transactionRepo.update(preparedTx.id, { status: PaymentStatus.CANCELED });
      return { error: clickError, error_note: 'Transaction failed on Click side' };
    }

    await this.transactionRepo.update(preparedTx.id, { status: PaymentStatus.PAID });

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: planId,
      merchant_confirm_id: preparedTx.id,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  private _validateSignature(params: GenerateMd5HashParams, signString: string) {
    const generatedHash = generateMD5(params);
    if (generatedHash !== signString) {
      return { error: ClickError.SignFailed, error_note: 'Signature validation failed' };
    }
    return null;
  }

  private async _validateTransaction(userId: string, planId: string) {
    if (!userId || !planId || userId.trim() === '' || planId.trim() === '') {
      return { error: { error: ClickError.UserNotFound, error_note: 'Invalid userId or planId format' } };
    }

    const [user, plan] = await Promise.all([
      this.userRepo.findById(userId),
      this.planRepo.findById(planId)
    ]);

    if (!user) return { error: { error: ClickError.UserNotFound, error_note: 'User not found' } };
    if (!plan) return { error: { error: ClickError.TransactionNotFound, error_note: 'Plan not found' } };

    return { user, plan, error: null };
  }
}