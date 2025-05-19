import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Response,
} from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAuthLoginDto,
  CreateAuthRegisterDto,
} from './dto/create-auth.dto';
import bcrypt from 'bcrypt';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import cookieParser from 'cookie-parser';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async register(createAuthRegisterDto: CreateAuthRegisterDto) {
    const findUser = await this.prismaService.user.findUnique({
      where: { email: createAuthRegisterDto.email },
    });

    if (findUser) throw new ConflictException('Username already exists 🍍');

    const hashedPass = await bcrypt.hash(createAuthRegisterDto.password, 12);

    const newUser = await this.prismaService.user.create({
      data: {
        ...createAuthRegisterDto,
        password: hashedPass,
      },
    });

    const token = await this.jwtService.signAsync({ user_id: newUser.id });

    return {
      success: true,
      message: 'User registered successfully',
      data: {
        newUser,
        token,
      },
    };
  }

  async login(createAuthLoginDto: CreateAuthLoginDto, res: ExpressResponse) {
    const findUser = await this.prismaService.user.findUnique({
      where: { email: createAuthLoginDto.email },
    });

    if (!findUser)
      throw new UnauthorizedException('Email or password incorrect');

    const comparePass = await bcrypt.compare(
      createAuthLoginDto.password,
      findUser.password,
    );

    if (!comparePass) throw new UnauthorizedException('Password incorrect');

    const token = await this.jwtService.signAsync({ user_id: findUser.id });
    const userSubscription = await this.subscriptionsService.getSubscription(
      findUser.id,
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: 'User logged in successfully',
      data: {
        user: findUser,
        subscription: userSubscription,
      },
    };
  }

  async logout(res: ExpressResponse) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      success: true,
      message: 'User logged out successfully',
    };
  }
}
