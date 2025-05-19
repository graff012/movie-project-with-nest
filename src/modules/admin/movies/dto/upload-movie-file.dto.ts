import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Quality } from '@prisma/client';

export class UploadMovieFileDto {
  @IsEnum(Quality)
  @IsNotEmpty()
  quality: Quality;

  @IsString()
  @IsNotEmpty()
  language: string;
}
