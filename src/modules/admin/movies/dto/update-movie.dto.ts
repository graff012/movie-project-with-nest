import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class UpdateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  subscription_type: SubscriptionType;

  @IsArray()
  @IsNotEmpty()
  category_ids: string[];

  @IsOptional()
  updatedAt?: Date;
}
