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
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;
}

class CreateTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNumber()
  time!: number;

  @IsNumber()
  amount!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => AccountDto)
  account!: AccountDto;
}

export class CreateTransactionDto {
  @IsIn([TransactionMethods.CreateTransaction])
  method!: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateTransactionParamsDto)
  params!: CreateTransactionParamsDto;
}
