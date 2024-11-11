import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { SessionAuthGuard } from '../auth/auth.guard';

@ApiTags('Vinyl')
@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @ApiOperation({ summary: 'Create a new vinyl record' })
  @ApiResponse({ status: 201, description: 'Vinyl record created successfully' })
  @UseGuards(SessionAuthGuard, AdminGuard)
  @Post('create')
  async create(@Body() createVinylDto: CreateVinylDto) {
    try {
      const vinyl = await this.vinylService.create(createVinylDto);
      return { statusCode: HttpStatus.CREATED, message: 'Vinyl record created successfully', data: vinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Retrieve list of vinyl records with pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', example: 10 })
  @ApiQuery({ name: 'name', required: false, description: 'Search by vinyl name' })
  @ApiQuery({ name: 'artist', required: false, description: 'Search by artist name' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by price, name, or artist', example: 'name' })
  @ApiResponse({ status: 200, description: 'List of vinyl records with pagination' })
  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name?: string,
    @Query('artist') artist?: string,
    @Query('sortBy') sortBy: 'price' | 'name' | 'artist' = 'name',
  ) {
    try {
      const vinyls = await this.vinylService.findAll(page, pageSize, name, artist, sortBy);
      return { statusCode: HttpStatus.OK, data: vinyls };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Get a vinyl record by ID' })
  @ApiParam({ name: 'id', description: 'ID of the vinyl record' })
  @ApiResponse({ status: 200, description: 'Vinyl record data' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const vinyl = await this.vinylService.findOne(id);
      return { statusCode: HttpStatus.OK, data: vinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Update a vinyl record by ID' })
  @ApiParam({ name: 'id', description: 'ID of the vinyl record' })
  @ApiResponse({ status: 200, description: 'Vinyl record updated successfully' })
  @UseGuards(SessionAuthGuard, AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateVinylDto: UpdateVinylDto) {
    try {
      const updatedVinyl = await this.vinylService.update(id, updateVinylDto);
      return { statusCode: HttpStatus.OK, message: 'Vinyl record updated successfully', data: updatedVinyl };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete a vinyl record by ID' })
  @ApiParam({ name: 'id', description: 'ID of the vinyl record' })
  @ApiResponse({ status: 204, description: 'Vinyl record deleted successfully' })
  @UseGuards(SessionAuthGuard, AdminGuard)
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

