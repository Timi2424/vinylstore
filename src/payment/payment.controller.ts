import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly stripeService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentDto: { amount: number; currency: string }) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentDto.amount,
      createPaymentDto.currency,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}