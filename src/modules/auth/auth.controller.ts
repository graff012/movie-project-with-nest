import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guard/auth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  CreateAuthLoginDto,
  CreateAuthRegisterDto,
} from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthRegisterDto: CreateAuthRegisterDto) {
    return await this.authService.register(createAuthRegisterDto);
  }

  @Post('login')
  @UseGuards(AuthGuard)
  async login(
    @Body() createAuthLoginDto: CreateAuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(createAuthLoginDto, res);
    return result;
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }
}
