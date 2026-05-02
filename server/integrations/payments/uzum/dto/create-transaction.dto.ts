import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export class CreateTransactionDto {
  @IsNumber()
  serviceId!: number;

  @IsNumber()
  timestamp!: number;

  @IsString()
  @IsNotEmpty()
  transId!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateTransactionParamsDto)
  params!: CreateTransactionParamsDto;

  @IsNumber()
  amount!: number;
}
