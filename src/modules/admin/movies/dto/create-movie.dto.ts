import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  release_year: number;

  @IsNumber()
  @IsNotEmpty()
  duration_minutes: number;

  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  subscription_type: SubscriptionType;

  @IsArray()
  @IsNotEmpty()
  category_ids: string[];

  @IsString()
  @IsOptional()
  poster?: string;
}
