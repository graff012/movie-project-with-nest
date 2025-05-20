import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminInitController } from './admin-init.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../core/database/prisma.module';
import { SubscriptionsModule } from '../subscriptions/subscription.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    ConfigModule,
    PrismaModule,
    SubscriptionsModule,
  ],
  controllers: [AuthController, AdminInitController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
