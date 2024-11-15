import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Review } from '../model/review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { systemLogger } from '../utils/logger';

@Injectable()
export class ReviewService {
  async createReview(createReviewDto: CreateReviewDto, auth0Id: string): Promise<Review> {
    try {
      const review = await Review.create({ ...createReviewDto, auth0Id });
      systemLogger.log(`Review ${review.id} created for vinyl ${createReviewDto.vinylId}`);
      return review;
    } catch (error) {
      systemLogger.error('Failed to create review', error);
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  async getReviewsByVinylId(vinylId: string, page: number = 1, pageSize: number = 10) {
    try {
      const offset = (page - 1) * pageSize;
      const reviews = await Review.findAndCountAll({
        where: { vinylId },
        offset,
        limit: pageSize,
      });
      const totalPages = Math.ceil(reviews.count / pageSize);
      return { reviews: reviews.rows, totalPages };
    } catch (error) {
      systemLogger.error('Failed to retrieve reviews', error);
      throw new InternalServerErrorException('Failed to retrieve reviews');
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    const review = await Review.findByPk(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    try {
      await review.destroy();
      systemLogger.log(`Review with ID ${reviewId} deleted`);
    } catch (error) {
      systemLogger.error('Failed to delete review', error);
      throw new InternalServerErrorException('Failed to delete review');
    }
  }
}
