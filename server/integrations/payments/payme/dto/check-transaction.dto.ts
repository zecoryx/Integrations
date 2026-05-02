import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransactionMethods } from '../constants/transaction-methods';

class CheckTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class CheckTransactionDto {
  @IsIn([TransactionMethods.CheckTransaction])
  method!: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => CheckTransactionParamsDto)
  params!: CheckTransactionParamsDto;
}
