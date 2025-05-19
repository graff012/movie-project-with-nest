import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/core/database/prisma.service';

export class RoleGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;

    const findUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) throw new ForbiddenException('User not found');

    const role = findUser?.role;
    const target = context.getHandler();
    const mainRoles = this.reflector.get('roles', target);

    if (!mainRoles.includes(role))
      throw new ForbiddenException('Role required');

    return true;
  }
}
