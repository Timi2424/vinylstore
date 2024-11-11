import { Controller, Post, Get, Delete, Body, Param, Query, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { SessionAuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AuthenticatedRequest } from '../types/authReq.type';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @UseGuards(SessionAuthGuard)
  @Post('create')
  async createReview(@Body() createReviewDto: CreateReviewDto, @Req() req: AuthenticatedRequest) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException('User ID not found', HttpStatus.UNAUTHORIZED);
      }
      const review = await this.reviewService.createReview(createReviewDto, userId);
      return { statusCode: HttpStatus.CREATED, message: 'Review created successfully', data: review };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get all reviews for a vinyl record' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', example: 10 })
  @ApiParam({ name: 'vinylId', description: 'ID of the vinyl record' })
  @ApiResponse({ status: 200, description: 'List of reviews with pagination' })
  @Get('vinyl/:vinylId')
  async getReviewsByVinylId(
    @Param('vinylId') vinylId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    try {
      const reviews = await this.reviewService.getReviewsByVinylId(vinylId, page, pageSize);
      return { statusCode: HttpStatus.OK, data: reviews };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiParam({ name: 'reviewId', description: 'ID of the review' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @UseGuards(SessionAuthGuard, AdminGuard)
  @Delete(':reviewId')
  async deleteReview(@Param('reviewId') reviewId: string) {
    try {
      await this.reviewService.deleteReview(reviewId);
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Review deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
