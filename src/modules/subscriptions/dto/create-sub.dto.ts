import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  durationDays: number;

  @IsArray()
  features: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
