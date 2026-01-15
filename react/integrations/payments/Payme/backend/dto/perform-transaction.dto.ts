import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TransactionMethods } from '../constants/transaction-methods';

class PerformTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class PerformTransactionDto {
  @IsIn([TransactionMethods.PerformTransaction])
  method: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => PerformTransactionParamsDto)
  params: PerformTransactionParamsDto;
}
