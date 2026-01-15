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

class AccountDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}

class CheckPerformTransactionParamsDto {
  @IsNumber()
  amount: number;

  @IsObject()
  @ValidateNested()
  @Type(() => AccountDto)
  account: AccountDto;
}

export class CheckPerformTransactionDto {
  @IsIn([TransactionMethods.CheckPerformTransaction])
  method: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => CheckPerformTransactionParamsDto)
  params: CheckPerformTransactionParamsDto;
}
