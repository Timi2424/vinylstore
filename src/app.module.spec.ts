import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('AppModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
