import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { Vinyl } from '../model/vinyl.model';
import { systemLogger } from '../utils/logger';

@Injectable()
export class VinylService {
  async create(createVinylDto: CreateVinylDto): Promise<Vinyl> {
    try {
      const vinyl = await Vinyl.create(createVinylDto);
      systemLogger.log(`Vinyl record ${vinyl.id} created`);
      return vinyl;
    } catch (error) {
      systemLogger.error('Failed to create vinyl record', error);
      throw new InternalServerErrorException('Failed to create vinyl record');
    }
  }

  async findAll(): Promise<Vinyl[]> {
    try {
      return await Vinyl.findAll({ include: { all: true } });
    } catch (error) {
      systemLogger.error('Failed to retrieve vinyl records', error);
      throw new InternalServerErrorException('Failed to retrieve vinyl records');
    }
  }

  async findOne(id: string): Promise<Vinyl> {
    const vinyl = await Vinyl.findByPk(id, { include: { all: true } });
    if (!vinyl) {
      systemLogger.warn(`Vinyl record with id ${id} not found`);
      throw new NotFoundException(`Vinyl with id ${id} not found`);
    }
    return vinyl;
  }

  async update(id: string, updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
    const vinyl = await Vinyl.findByPk(id);
    if (!vinyl) {
      throw new NotFoundException(`Vinyl record with id ${id} not found`);
    }

    try {
      await vinyl.update(updateVinylDto);
      systemLogger.log(`Vinyl record with id ${id} updated`);
      return vinyl;
    } catch (error) {
      systemLogger.error(`Failed to update vinyl record with id ${id}`, error);
      throw new InternalServerErrorException(`Failed to update vinyl record with id ${id}`);
    }
  }

  async remove(id: string): Promise<void> {
    const vinyl = await Vinyl.findByPk(id);
    if (!vinyl) {
      throw new NotFoundException(`Vinyl record with id ${id} not found`);
    }

    try {
      await vinyl.destroy();
      systemLogger.log(`Vinyl record with id ${id} deleted`);
    } catch (error) {
      systemLogger.error(`Failed to delete vinyl record with id ${id}`, error);
      throw new InternalServerErrorException(`Failed to delete vinyl record with id ${id}`);
    }
  }
}
