import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

class PaymentDetailsDto {
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  expiry: string;

  @IsString()
  @IsNotEmpty()
  card_holder: string;
}

export class PurchaseSubDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  plan_id: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsBoolean()
  @IsOptional()
  auto_renew?: boolean = true;

  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  payment_details: PaymentDetailsDto;
}
