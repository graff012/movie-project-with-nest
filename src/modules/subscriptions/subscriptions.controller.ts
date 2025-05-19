import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { PurchaseSubDto } from './dto/purchase-sub.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
  ) {}

  @Get('plans')
  async getSubscriptionPlans() {
    return this.subscriptionService.getSubscriptionPlans();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createSubscription(@Body() createSubDto: CreateSubDto) {
    return await this.subscriptionService.createSubscription(createSubDto);
  }

  @Get()
  async getSubscription(@Param('id') id: string) {
    return await this.subscriptionService.getSubscription(id);
  }

  @Put()
  async updateSubscription(
    @Param('id') id: string,
    @Body() createSubDto: CreateSubDto,
  ) {
    return await this.subscriptionService.updateSubscription(id, createSubDto);
  }

  @Delete()
  async deleteSubscription(@Param('id') id: string) {
    return await this.subscriptionService.deleteSubscription(id);
  }

  @Post('purchase')
  @UsePipes(ValidationPipe)
  async purchaseSubscription(@Body() purchaseSubDto: PurchaseSubDto) {
    return await this.subscriptionService.purchaseSubscription(purchaseSubDto);
  }
}
