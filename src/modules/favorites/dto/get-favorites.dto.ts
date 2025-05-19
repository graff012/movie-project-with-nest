import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class GetFavoritesDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number = 10;
}
