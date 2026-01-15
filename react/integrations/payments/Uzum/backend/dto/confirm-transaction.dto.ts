import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmTransactionDto {
  @IsNumber()
  serviceId: number;

  @IsNumber()
  timestamp: number;

  @IsString()
  @IsNotEmpty()
  transId: string;
}
