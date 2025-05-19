import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscription.module';
import { UserModule } from './modules/users/users.module';
import { AdminMoviesModule } from './modules/admin/movies/movies.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    SubscriptionsModule,
    UserModule,
    AdminMoviesModule,
    MoviesModule,
    ReviewsModule,
    FavoritesModule
  ],
})
export class AppModule {}
