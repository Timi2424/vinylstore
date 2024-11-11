import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('stripe');
jest.mock('../email/email.service');

describe('PaymentService', () => {
  let service: PaymentService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        ConfigService,
        EmailService,
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should create a payment intent and send email', async () => {
    const createPaymentIntentMock = jest.fn().mockResolvedValue({ client_secret: 'secret' });
    const stripeInstance = service['stripe'] as unknown as { paymentIntents: { create: typeof createPaymentIntentMock } };
    stripeInstance.paymentIntents.create = createPaymentIntentMock;
    jest.spyOn(emailService, 'sendPaymentConfirmation').mockResolvedValue();

    const result = await service.createPaymentIntent(5000, 'usd', 'test@example.com');

    expect(result.client_secret).toEqual('secret');
    expect(emailService.sendPaymentConfirmation).toHaveBeenCalledWith('test@example.com', 5000);
  });

  it('should throw error if payment amount is invalid', async () => {
    await expect(service.createPaymentIntent(-100, 'usd', 'test@example.com')).rejects.toThrow(InternalServerErrorException);
  });
});
