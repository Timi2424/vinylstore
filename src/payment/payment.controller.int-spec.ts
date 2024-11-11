import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PaymentService } from './payment.service';


describe('PaymentController (integration)', () => {
  let app: INestApplication;
  let paymentService = { createPaymentIntent: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PaymentService)
      .useValue(paymentService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /payments/create-payment-intent', () => {
    const paymentIntent = { clientSecret: 'secret' };
    paymentService.createPaymentIntent.mockResolvedValue(paymentIntent);

    return request(app.getHttpServer())
      .post('/payments/create-payment-intent')
      .send({ amount: 5000, currency: 'pln' })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.clientSecret).toEqual(paymentIntent.clientSecret);
      });
  });
});
