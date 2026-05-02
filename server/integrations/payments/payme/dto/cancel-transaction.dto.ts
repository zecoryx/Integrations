import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransactionMethods } from '../constants/transaction-methods';

class CancelTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  reason!: number;
}

export class CancelTransactionDto {
  @IsIn([TransactionMethods.CancelTransaction])
  method!: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => CancelTransactionParamsDto)
  params!: CancelTransactionParamsDto;
}
