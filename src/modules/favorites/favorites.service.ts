import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GetFavoritesDto } from './dto/get-favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFavorites(userId: string, getFavoritesDto: GetFavoritesDto) {
    const { page = 1, limit = 10 } = getFavoritesDto;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prismaService.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          movies: {
            select: {
              id: true,
              title: true,
              slug: true,
              posterUrl: true,
              releaseYear: true,
              rating: true,
              subscriptionType: true,
            },
          },
        },
      }),
      this.prismaService.favorite.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: {
        movies: favorites.map((fav) => fav.movies),
        total,
      },
    };
  }

  async createFavorite(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const favorite = await this.prismaService.favorite.create({
      data: {
        userId,
        movieId: createFavoriteDto.movie_id,
      },
      include: {
        movies: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Favorite added successfully',
      data: {
        ...favorite,
        movie_title: favorite.movies.title,
      },
    };
  }

  async deleteFavorite(userId: string, movieId: string) {
    await this.prismaService.favorite.deleteMany({
      where: {
        userId,
        movieId,
      },
    });

    return {
      success: true,
      message: 'Favorite deleted successfully',
    };
  }
}
