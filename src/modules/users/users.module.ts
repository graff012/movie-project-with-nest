import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { PrismaModule } from '../core/database/prisma.module';
import { SubscriptionsModule } from '../subscriptions/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionsModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
