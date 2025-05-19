import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetMovieDto } from './dto/get-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query() dto: GetMoviesDto) {
    return {
      success: true,
      data: await this.moviesService.getMovies(dto),
    };
  }

  @Get(':slug')
  async getMovie(@Param() params: GetMovieDto) {
    return {
      success: true,
      data: await this.moviesService.getMovie(params.slug),
    };
  }
}
