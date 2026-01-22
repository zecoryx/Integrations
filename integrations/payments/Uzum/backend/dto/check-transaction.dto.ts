import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CheckTransactionParamsDto {
  @IsString()
  @IsNotEmpty()
  planId!: string;
}

export class CheckTransactionDto {
  @IsNumber()
  serviceId!: number;

  @IsNumber()
  timestamp!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CheckTransactionParamsDto)
  params!: CheckTransactionParamsDto;
}
