import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckTransactionStatusDto {
  @IsNumber()
  serviceId!: number;

  @IsString()
  @IsNotEmpty()
  transId!: string;

  @IsNumber()
  timestamp!: number;
}
