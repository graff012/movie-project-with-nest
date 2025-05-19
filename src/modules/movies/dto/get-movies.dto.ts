import { IsOptional, IsInt, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';

export class GetMoviesDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  limit: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsEnum(SubscriptionType)
  @IsOptional()
  subscription_type: SubscriptionType;
}
