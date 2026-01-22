import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClickRequestDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  click_trans_id!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  service_id!: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  click_paydoc_id!: number;

  @IsString()
  @IsNotEmpty()
  merchant_trans_id!: string;

  // param1 can be used for merchant_user_id
  @IsOptional()
  @IsString()
  param1?: string;

  // param2 is used for our internal userId
  @IsOptional()
  @IsString()
  param2?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  amount!: number;

  @Transform(({ value }) => Number(value))
  @IsIn([0, 1])
  action!: 0 | 1;

  @Transform(({ value }) => Number(value))
  @IsIn([0, 1, -1, -9]) // Possible values for error
  error!: number;

  @IsString()
  @IsNotEmpty()
  error_note!: string;

  @IsString()
  @IsNotEmpty()
  sign_time!: string;

  @IsString()
  @IsNotEmpty()
  sign_string!: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  merchant_prepare_id?: number;
}
