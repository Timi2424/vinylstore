import { Controller, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { AuthenticatedRequest } from '../types/authReq.type';


@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Amount in smallest currency unit (e.g., cents)' },
        currency: { type: 'string', description: 'Currency code (e.g., "usd")' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Client secret for the payment intent' })
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() createPaymentDto: { amount: number; currency: string },
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const userEmail = req.user.email;
      const paymentIntent = await this.paymentService.createPaymentIntent(
        createPaymentDto.amount,
        createPaymentDto.currency,
        userEmail,
      );
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new HttpException(
        'Failed to create payment intent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
