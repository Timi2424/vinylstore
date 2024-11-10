import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { VinylRecord } from '../model/record.model';
import { Review } from '../model/review.model';
import { User } from '../model/user.model';

@Injectable()
export class VinylService {
  constructor(
    @InjectModel(VinylRecord)
    private readonly vinylRecordModel: typeof VinylRecord,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ rows: VinylRecord[]; count: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.vinylRecordModel.findAndCountAll({
      include: [
        {
          model: Review,
          include: [User],
          limit: 1,
          order: [['createdAt', 'ASC']],
        },
      ],
      attributes: {
        include: [
          [
            this.sequelize.fn('AVG', this.sequelize.col('reviews.rating')),
            'averageRating',
          ],
        ],
      },
      group: ['VinylRecord.id', 'reviews.id', 'reviews->user.id'],
      limit,
      offset,
      subQuery: false,
    });

    return { rows, count: count.length };
  }
}
