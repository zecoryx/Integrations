import { PrismaClient } from '@prisma/client';
import { generateMD5 } from '../../../../utils/hashing';
import { ClickError } from './constants/status-codes';
import { TransactionActions } from './constants/transaction-actions';
import { ClickRequestDto } from './dto/click-request.dto';
import { GenerateMd5HashParams } from './interfaces/generate-prepare-hash.interface';

const prisma = new PrismaClient();

export class ClickService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.CLICK_SECRET || '';
    if (!this.secretKey) {
      throw new Error('CLICK_SECRET is not configured in environment variables.');
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

  private async prepare(clickReqBody: ClickRequestDto) {
    const {
      click_trans_id: clickTransId,
      service_id: serviceId,
      merchant_trans_id: planId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
      param2: userId,
    } = clickReqBody;

    const signatureError = this._validateSignature(
      {
        clickTransId: String(clickTransId),
        serviceId,
        secretKey: this.secretKey,
        merchantTransId: planId,
        amount,
        action,
        signTime,
      },
      signString,
    );
    if (signatureError) {
      return signatureError;
    }

    const { user, plan, error } = await this._validateTransaction(userId || '', planId || '');
    if (error) {
      return error;
    }

    const existingTransaction = await prisma.transactions.findFirst({
      where: {
        userId: user.id,
        planId: plan.id,
        status: { in: ['PAID', 'CANCELED'] },
      },
    });

    if (existingTransaction) {
      if (existingTransaction.status === 'PAID') {
        return { error: ClickError.AlreadyPaid, error_note: 'Already paid' };
      }
      if (existingTransaction.status === 'CANCELED') {
        return { error: ClickError.TransactionCanceled, error_note: 'Transaction is canceled' };
      }
    }

    if (Number(amount) !== plan.price) {
      return { error: ClickError.InvalidAmount, error_note: 'Invalid amount' };
    }

    const time = new Date().getTime();
    const newTransaction = await prisma.transactions.create({
      data: {
        plan: { connect: { id: plan.id } },
        user: { connect: { id: user.id } },
        transId: String(clickTransId),
        prepareId: time,
        status: 'PENDING',
        provider: 'click',
        amount: Number(amount),
        createdAt: new Date(time),
      },
    });

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: planId,
      merchant_prepare_id: newTransaction.prepareId,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  private async complete(clickReqBody: ClickRequestDto) {
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
    } = clickReqBody;

    const signatureError = this._validateSignature(
      {
        clickTransId: String(clickTransId),
        serviceId,
        secretKey: this.secretKey,
        merchantTransId: planId,
        merchantPrepareId: prepareId,
        amount,
        action,
        signTime,
      },
      signString,
    );
    if (signatureError) {
      return signatureError;
    }

    const { user, plan, error: validationError } = await this._validateTransaction(
      userId || '',
      planId || '',
    );
    if (validationError) {
      return validationError;
    }

    const preparedTransaction = await prisma.transactions.findFirst({
      where: {
        prepareId: Number(prepareId),
        userId: user.id,
        planId: plan.id,
      },
    });

    if (!preparedTransaction) {
      return {
        error: ClickError.TransactionNotFound,
        error_note: 'Transaction not found or invalid merchant_prepare_id',
      };
    }

    if (preparedTransaction.status === 'PAID') {
      return { error: ClickError.AlreadyPaid, error_note: 'Already paid' };
    }

    if (preparedTransaction.status === 'CANCELED') {
      return { error: ClickError.TransactionCanceled, error_note: 'Transaction is already canceled' };
    }

    if (Number(amount) !== plan.price) {
      return { error: ClickError.InvalidAmount, error_note: 'Invalid amount' };
    }

    if (clickError !== 0) {
      await prisma.transactions.update({
        where: { id: preparedTransaction.id },
        data: { status: 'CANCELED' },
      });
      return { error: clickError, error_note: 'Transaction failed on Click side' };
    }

    await prisma.transactions.update({
      where: { id: preparedTransaction.id },
      data: { status: 'PAID' },
    });

    // TODO: Implement the business logic for a successful transaction.

    return {
      click_trans_id: clickTransId,
      merchant_trans_id: planId,
      merchant_confirm_id: preparedTransaction.id,
      error: ClickError.Success,
      error_note: 'Success',
    };
  }

  private _validateSignature(params: GenerateMd5HashParams, signString: string) {
    const generatedHash = generateMD5(params);
    if (generatedHash !== signString) {
      return {
        error: ClickError.SignFailed,
        error_note: 'Signature validation failed',
      };
    }
    return null;
  }

  private async _validateTransaction(userId: string, planId: string) {
    // Validate that userId and planId are non-empty strings
    // Note: Prisma uses string IDs, not MongoDB ObjectId
    if (!userId || !planId || userId.trim() === '' || planId.trim() === '') {
      return {
        error: {
          error: ClickError.UserNotFound,
          error_note: 'Invalid userId or planId format',
        },
      };
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return { error: { error: ClickError.UserNotFound, error_note: 'User not found' } };
    }

    const plan = await prisma.plans.findUnique({ where: { id: planId } });
    if (!plan) {
      return {
        error: {
          error: ClickError.TransactionNotFound,
          error_note: 'Plan or product not found',
        },
      };
    }

    return { user, plan, error: null };
  }
}