import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from 'src/modules/common/guard/auth.guard';

@Controller('api/movies')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':movie_id/reviews')
  async createReview(
    @Param('movie_id') movieId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.create(movieId, req.user.id, createReviewDto);
  }

  @Delete(':movie_id/reviews/:review_id')
  async deleteReview(
    @Param('movie_id') movieId: string,
    @Param('review_id') reviewId: string,
  ) {
    return this.reviewsService.delete(movieId, reviewId);
  }
}
