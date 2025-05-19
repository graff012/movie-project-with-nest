import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../core/database/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    movieId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        movieId,
        userId,
      },
      include: {
        users: true,
      },
    });
  }

  async delete(movieId: string, reviewId: string) {
    return this.prisma.review.delete({
      where: {
        id: reviewId,
        movieId,
      },
    });
  }
}
