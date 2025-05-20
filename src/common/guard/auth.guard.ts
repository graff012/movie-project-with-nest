import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.auth_token;
    if (!token) throw new ForbiddenException('No authorization token found');

    try {
      const { user_id } = await this.jwtService.verifyAsync(token);
      request.userId = user_id;

      return true;
    } catch (err) {
      console.error(err);
      throw new ForbiddenException('Token invalid');
    }
  }
}
