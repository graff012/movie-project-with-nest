import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/database/prisma.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { PurchaseSubDto } from './dto/purchase-sub.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSubscriptionPlans() {
    const plans = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Free',
        price: 0.0,
        duration_days: 0,
        features: ['SD quality movies', 'With ads'],
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Premium',
        price: 49.99,
        duration_days: 30,
        features: ['HD quality movies', 'Without ads', 'New movies'],
      },
    ];

    return {
      success: true,
      data: plans,
    };
  }

  async createSubscription(createSubDto: CreateSubDto) {
    return await this.prismaService.subscriptionPlan.create({
      data: {
        ...createSubDto,
        features: JSON.stringify(createSubDto.features),
      },
    });
  }

  async getSubscription(id: string) {
    return await this.prismaService.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async updateSubscription(id: string, createSubDto: CreateSubDto) {
    return await this.prismaService.subscriptionPlan.update({
      where: { id },
      data: {
        ...createSubDto,
      },
    });
  }

  async deleteSubscription(id: string) {
    return await this.prismaService.subscriptionPlan.delete({
      where: { id },
    });
  }

  async purchaseSubscription(purchaseSubDto: PurchaseSubDto) {
    const plan = await this.prismaService.subscriptionPlan.findUnique({
      where: { id: purchaseSubDto.plan_id },
    });

    if (!plan) {
      throw new BadRequestException('Invalid subscription plan');
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const subscription = await this.prismaService.userSubscription.create({
      data: {
        id: uuidv4(),
        plan_id: plan.id,
        startDate,
        endDate,
        status: 'active',
        autoRenew: purchaseSubDto.auto_renew ?? true,
        user_id: purchaseSubDto.user_id,
      },
    });

    const payment = await this.prismaService.payment.create({
      data: {
        id: uuidv4(),
        userSubscriptionId: subscription.id,
        amount: plan.price,
        status: 'completed',
        paymentMethod: purchaseSubDto.payment_method,
        externalTransactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        paymentDetails: {
          card_number: purchaseSubDto.payment_details.card_number,
          expiry: purchaseSubDto.payment_details.expiry,
          card_holder: purchaseSubDto.payment_details.card_holder,
        },
      },
    });

    return {
      success: true,
      message: 'Subscription purchased successfully',
      data: {
        subscription: {
          id: subscription.id,
          plan: {
            id: plan.id,
            name: plan.name,
          },
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: subscription.status,
          auto_renew: subscription.autoRenew,
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          external_transaction_id: payment.externalTransactionId,
          payment_method: payment.paymentMethod,
        },
      },
    };
  }
}
