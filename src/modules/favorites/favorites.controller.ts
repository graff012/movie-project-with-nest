import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';
import { FavoritesService } from './favorites.service';
import { GetFavoritesDto } from './dto/get-favorites.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('api/favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Request() req, @Body() dto: GetFavoritesDto) {
    return this.favoritesService.getFavorites(req.user.id, dto);
  }

  @Post()
  async createFavorite(@Request() req, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.createFavorite(req.user.id, dto);
  }

  @Delete(':movieId')
  async deleteFavorite(@Request() req, @Param('movieId') movieId: string) {
    return this.favoritesService.deleteFavorite(req.user.id, movieId);
  }
}
