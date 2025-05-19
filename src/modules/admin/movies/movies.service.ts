import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UploadMovieFileDto } from './dto/upload-movie-file.dto';
import slugify from 'slugify';
import { PrismaService } from 'src/modules/core/database/prisma.service';

@Injectable()
export class AdminMoviesService {
  constructor(private prisma: PrismaService) {}

  async getMovies() {
    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          releaseYear: true,
          subscriptionType: true,
          viewCount: true,
          createdAt: true,
          createdBy: {
            select: {
              username: true,
            },
          },
        },
      }),
      this.prisma.movie.count(),
    ]);

    return {
      success: true,
      data: {
        movies,
        total,
      },
    };
  }

  async createMovie(
    userId: string,
    createMovieDto: CreateMovieDto,
    poster?: Express.Multer.File,
  ) {
    const slug = slugify(createMovieDto.title, {
      lower: true,
      replacement: '-',
    });

    const movie = await this.prisma.movie.create({
      data: {
        slug,
        createdById: userId,
        createdAt: new Date(),
        posterUrl: poster ? poster.path : '',
        movieCategories: {
          create: createMovieDto.category_ids.map((categoryId) => ({
            categoryId,
          })),
        },
        title: createMovieDto.title,
        description: createMovieDto.description,
        releaseYear: createMovieDto.release_year,
        durationMinutes: createMovieDto.duration_minutes,
        subscriptionType: createMovieDto.subscription_type,
        rating: 0,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      message: 'New movie added successfully',
      data: movie,
    };
  }

  async updateMovie(
    movieId: string,
    updateMovieDto: UpdateMovieDto,
    userId: string,
  ) {
    try {
      const movie = await this.prisma.movie.update({
        where: { id: movieId },
        data: {
          ...updateMovieDto,
          ...updateMovieDto,
          ...(updateMovieDto.category_ids &&
            updateMovieDto.category_ids.length > 0 && {
              movieCategories: {
                deleteMany: {},
                create: updateMovieDto.category_ids.map((categoryId) => ({
                  categoryId,
                })),
              },
            }),
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        message: 'Movie updated successfully',
        data: movie,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Movie not found');
      }
      throw error;
    }
  }

  async deleteMovie(movieId: string) {
    await this.prisma.movie.delete({
      where: { id: movieId },
    });

    return {
      success: true,
      message: 'Movie deleted successfully',
    };
  }

  async uploadMovieFile(
    movieId: string,
    uploadMovieFileDto: UploadMovieFileDto,
    file: Express.Multer.File,
  ) {
    const movieFile = await this.prisma.movieFiles.create({
      data: {
        movieId,
        fileUrl: file.path,
        quality: uploadMovieFileDto.quality,
        language: uploadMovieFileDto.language,
        ...(file.size && { sizeMb: file.size / (1024 * 1024) }),
      },
      select: {
        id: true,
        movieId: true,
        quality: true,
        language: true,
        ...(file.size && { sizeMb: true }),
        fileUrl: true,
      },
    });

    return {
      success: true,
      message: 'Movie uploaded successfully',
      data: movieFile,
    };
  }
}
