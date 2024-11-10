import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto.js';
import { UpdateVinylDto } from './dto/update-vinyl.dto.js';
import { Vinyl } from '../model/vinyl.model.js';

@Injectable()
export class VinylService {
  constructor() {}

  async create(createVinylDto: CreateVinylDto): Promise<Vinyl> {
    return Vinyl.create(createVinylDto);
  }

  async findAll(): Promise<Vinyl[]> {
    return Vinyl.findAll({ include: { all: true } });
  }

  async findOne(id: string): Promise<Vinyl> {
    const vinyl = await Vinyl.findByPk(id, { include: { all: true } });
    if (!vinyl) {
      throw new NotFoundException(`Vinyl with id ${id} not found`);
    }
    return vinyl;
  }

  async update(id: string, updateVinylDto: UpdateVinylDto): Promise<Vinyl> {
    const vinyl = await Vinyl.findByPk(id);
    return vinyl.update(updateVinylDto);
  }

  async remove(id: string): Promise<void> {
    const vinyl = await Vinyl.findByPk(id);
    await vinyl.destroy();
  }
}
