import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { Review } from '../model/review.model';
import { NotFoundException,  } from '@nestjs/common';

jest.mock('../model/review.model');
jest.mock('../utils/logger');

type FindAndCountAllResult<T> = { rows: T[]; count: number };

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should create a review', async () => {
    const createReviewDto = { content: 'Great!', rating: 5, vinylId: '1' };
    const review = { id: '1', ...createReviewDto } as Review;
    jest.spyOn(Review, 'create').mockResolvedValue(review);

    const result = await service.createReview(createReviewDto, 'user1');
    expect(result).toEqual(review);
  });

  it('should get reviews for a vinyl record with pagination', async () => {
    const reviews = [{ id: '1', content: 'Review', rating: 5, vinylId: '1' }] as Review[];

    jest.spyOn(Review, 'findAndCountAll').mockResolvedValue({
      rows: reviews,
      count: 1,
    } as FindAndCountAllResult<Review>);

    const result = await service.getReviewsByVinylId('1');
    expect(result.reviews).toEqual(reviews);
    expect(result.totalPages).toBe(1);
  });

  it('should delete a review', async () => {
    const review = { id: '1', destroy: jest.fn() } as any;
    jest.spyOn(Review, 'findByPk').mockResolvedValue(review);

    await service.deleteReview('1');
    expect(review.destroy).toHaveBeenCalled();
  });

  it('should throw NotFoundException if review not found', async () => {
    jest.spyOn(Review, 'findByPk').mockResolvedValue(null);

    await expect(service.deleteReview('1')).rejects.toThrow(NotFoundException);
  });
});
