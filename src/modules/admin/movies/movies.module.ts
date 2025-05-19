import { Module } from '@nestjs/common';
import { AdminMoviesController } from './movies.controller';
import { AdminMoviesService } from './movies.service';
import { AuthModule } from '../../auth/auth.module';
import { CoreModule } from 'src/modules/core/core.module';

@Module({
  imports: [AuthModule, CoreModule],
  controllers: [AdminMoviesController],
  providers: [AdminMoviesService],
})
export class AdminMoviesModule {}
