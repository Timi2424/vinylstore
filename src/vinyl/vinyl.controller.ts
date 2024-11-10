import { Controller, Get, Query } from '@nestjs/common';
import { VinylService } from './vinyl.service';


@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylRecordService: VinylService) {}

  @Get()
  async getVinylRecords(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { rows, count } = await this.vinylRecordService.findAll(
      Number(page),
      Number(limit),
    );
    return {
      data: rows,
      total: count,
      page: Number(page),
      pageCount: Math.ceil(count / Number(limit)),
    };
  }
}
