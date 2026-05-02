import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { TransactionMethods } from '../constants/transaction-methods';

class GetStatementParamsDto {
  @IsNumber()
  from!: number;

  @IsNumber()
  to!: number;
}

export class GetStatementDto {
  @IsIn([TransactionMethods.GetStatement])
  method!: TransactionMethods;

  @IsObject()
  @ValidateNested()
  @Type(() => GetStatementParamsDto)
  params!: GetStatementParamsDto;
}
