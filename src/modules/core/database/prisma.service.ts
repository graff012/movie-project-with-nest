import { InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected');
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
