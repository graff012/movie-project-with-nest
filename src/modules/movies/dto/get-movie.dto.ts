import { IsString, IsNotEmpty } from 'class-validator';

export class GetMovieDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
