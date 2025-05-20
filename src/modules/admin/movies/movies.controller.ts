import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { resolve } from 'path';
import { AdminMoviesService } from './movies.service';
import { AuthGuard } from '../../../common/guard/auth.guard';
import { Request, Express } from 'express';
import { ForbiddenException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UploadMovieFileDto } from './dto/upload-movie-file.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: 'user' | 'admin' | 'superadmin';
  };
}

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminMoviesController {
  constructor(private readonly moviesService: AdminMoviesService) {}

  private checkAdminRole(user: AuthenticatedRequest['user']) {
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      throw new ForbiddenException('Only admin users can perform this action');
    }
  }

  @Get('movies')
  async getMovies(@Req() req: AuthenticatedRequest) {
    this.checkAdminRole(req.user);
    return this.moviesService.getMovies();
  }

  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: resolve(__dirname, '../uploads/posters'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  @Post('movies')
  async createMovie(
    @Req() req: AuthenticatedRequest,
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() poster?: Express.Multer.File,
  ) {
    this.checkAdminRole(req.user);
    return this.moviesService.createMovie(req.user.id, createMovieDto, poster);
  }

  @Put(':movie_id')
  async updateMovie(
    @Param('movie_id') movieId: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(movieId, updateMovieDto, req.user.id);
  }

  @Delete(':movie_id')
  async deleteMovie(@Param('movie_id') movieId: string) {
    return this.moviesService.deleteMovie(movieId);
  }

  @Post(':movie_id/files')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: resolve(__dirname, './uploads/movies'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadMovieFile(
    @Param('movie_id') movieId: string,
    @Body() uploadMovieFileDto: UploadMovieFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.moviesService.uploadMovieFile(
      movieId,
      uploadMovieFileDto,
      file,
    );
  }
}
