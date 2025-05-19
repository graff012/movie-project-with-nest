import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  movie_id: string;
}
