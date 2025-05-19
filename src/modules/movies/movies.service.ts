import { Injectable } from '@nestjs/common';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetMovieDto } from './dto/get-movie.dto';
import { PrismaService } from '../core/database/prisma.service';
import { Prisma, Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMovie(slug: string): Promise<GetMovieDto | null> {
    const movie = await this.prismaService.movie.findFirst({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        releaseYear: true,
        durationMinutes: true,
        posterUrl: true,
        rating: true,
        subscriptionType: true,
        viewCount: true,
        createdById: true,
        createdAt: true,
        movieCategories: {
          select: {
            categories: {
              select: {
                name: true,
              },
            },
          },
        },
        movieFiles: {
          select: {
            quality: true,
            language: true,
          },
        },
        favorites: {
          select: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
        Review: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!movie) {
      return null;
    }

    // Transform the data to match the expected response format
    return {
      ...movie,
      categories: movie.movieCategories.map(mc => mc.categories.name),
      files: movie.movieFiles.map(file => ({
        quality: file.quality,
        language: file.language,
      })),
      is_favorite: movie.favorites.some(f => f.users.id === 'current_user_id'), // Replace with actual user ID check
      reviews: {
        average_rating: movie.Review.reduce((sum, review) => sum + review.rating, 0) / movie.Review.length,
        count: movie.Review.length,
      },
    } as GetMovieDto;
  }

  async getMovies(dto: GetMoviesDto) {
    const skip = (dto.page - 1) * dto.limit;
    const take = dto.limit;

    const where: any = {};

    if (dto.category) {
      where.categories = {
        some: {
          name: dto.category,
        },
      };
    }

    if (dto.search) {
      where.title = {
        contains: dto.search,
        mode: 'insensitive',
      };
    }

    if (dto.subscription_type) {
      where.subscriptionType = dto.subscription_type;
    }

    const [movies, total] = await Promise.all([
      this.prismaService.movie.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          title: true,
          slug: true,
          posterUrl: true,
          releaseYear: true,
          rating: true,
          subscriptionType: true,
          movieCategories: {
            select: {
              categories: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.movie.count({ where }),
    ]);

    const pages = Math.ceil(total / dto.limit);

    return {
      movies,
      pagination: {
        total,
        page: dto.page,
        limit: dto.limit,
        pages,
      },
    };
  }
}
