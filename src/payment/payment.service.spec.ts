import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: { create: jest.fn().mockResolvedValue({ client_secret: 'secret' }) },
  }));
});

describe('PaymentService', () => {
  let service: PaymentService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: EmailService, useValue: { sendPaymentConfirmation: jest.fn() } },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should create a payment intent and send email', async () => {
    const emailSpy = jest.spyOn(emailService, 'sendPaymentConfirmation').mockResolvedValue();
    const result = await service.createPaymentIntent(5000, 'pln', 'test@example.com');

    expect(result.client_secret).toBe('secret');
    expect(emailSpy).toHaveBeenCalledWith('test@example.com', 5000);
  });
});
