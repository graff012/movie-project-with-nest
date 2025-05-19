import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    const findUsers = await this.prismaService.user.findMany();
    if (findUsers.length === 0) throw new NotFoundException('No users found');

    return findUsers;
  }

  async getUserById(id: string): Promise<UserDto> {
    const findUser = await this.prismaService.user.findUnique({
      where: { id },
      include: { userSubscription: true },
    });

    if (!findUser) throw new NotFoundException(`User with ID ${id} not found`);

    return {
      id: findUser.id,
      username: findUser.username,
      fullname: findUser.fullname,
      email: findUser.email,
      role: findUser.role,
      userSubscription:
        findUser.userSubscription.length > 0
          ? findUser.userSubscription[0].id
          : '',
    };
  }

  async updateUsers(id: string, data: Promise<UserDto>) {
    const findUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!findUser) throw new NotFoundException(`User with ID ${id} not found`);

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const findUser = await this.prismaService.user.delete({
      where: { id },
    });

    if (!findUser) throw new NotFoundException(`User with ID ${id} not found`);

    return findUser;
  }
}
