import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string, userEmail: string) {
    if (amount <= 0) {
      throw new InternalServerErrorException('Invalid payment amount');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
    
    await this.emailService.sendPaymentConfirmation(userEmail, amount);

    return paymentIntent;
  }
}
