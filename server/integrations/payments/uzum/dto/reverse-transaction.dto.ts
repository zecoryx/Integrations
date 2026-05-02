import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReverseTransactionDto {
  @IsNumber()
  serviceId!: number;

  @IsString()
  @IsNotEmpty()
  transId!: string;

  @IsNumber()
  timestamp!: number;
}