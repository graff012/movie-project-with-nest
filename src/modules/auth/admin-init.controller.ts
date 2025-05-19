import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import bcrypt from 'bcryptjs';

@Controller('admin-init')
export class AdminInitController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('create-admin')
  async createAdmin(@Body() body: { email: string; password: string }) {
    const existingAdmin = await this.prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    });

    if (existingAdmin) {
      return {
        success: false,
        message: 'Admin user already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const admin = await this.prisma.user.create({
      data: {
        username: 'admin',
        fullname: 'Admin User',
        password: hashedPassword,
        email: body.email,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: admin,
      },
    };
  }
}
