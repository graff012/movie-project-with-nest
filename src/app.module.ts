import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionsModule } from './modules/subscriptions/subscription.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [CoreModule, AuthModule, SubscriptionsModule, UserModule],
})
export class AppModule {}
