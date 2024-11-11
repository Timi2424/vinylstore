import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Post('create')
  async create(@Body() createVinylDto: CreateVinylDto) {
    try {
      const vinyl = await this.vinylService.create(createVinylDto);
      return { statusCode: HttpStatus.CREATED, message: 'Vinyl record created successfully', data: vinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('all')
  async findAll() {
    try {
      const vinyls = await this.vinylService.findAll();
      return { statusCode: HttpStatus.OK, data: vinyls };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const vinyl = await this.vinylService.findOne(id);
      return { statusCode: HttpStatus.OK, data: vinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVinylDto: UpdateVinylDto) {
    try {
      const updatedVinyl = await this.vinylService.update(id, updateVinylDto);
      return { statusCode: HttpStatus.OK, message: 'Vinyl record updated successfully', data: updatedVinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.vinylService.remove(id);
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Vinyl record deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
