import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';


describe('ReviewController (integration)', () => {
  let app: INestApplication;
  let reviewService = { createReview: jest.fn(), getReviewsByVinylId: jest.fn(), deleteReview: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ReviewService)
      .useValue(reviewService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /reviews/create', () => {
    const dto: CreateReviewDto = { content: 'Great album!', rating: 5, vinylId: '1' };
    reviewService.createReview.mockResolvedValue(dto);

    return request(app.getHttpServer())
      .post('/reviews/create')
      .send(dto)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.data).toEqual(expect.objectContaining(dto));
      });
  });

  it('GET /reviews/vinyl/:vinylId', () => {
    const vinylId = '1';
    const reviews = [{ id: '1', content: 'Great album!', rating: 5, vinylId }];
    reviewService.getReviewsByVinylId.mockResolvedValue({ reviews, totalPages: 1 });

    return request(app.getHttpServer())
      .get(`/reviews/vinyl/${vinylId}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.data.reviews).toEqual(reviews);
      });
  });

  it('DELETE /reviews/:reviewId', () => {
    reviewService.deleteReview.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .delete('/reviews/1')
      .expect(HttpStatus.NO_CONTENT);
  });
});
