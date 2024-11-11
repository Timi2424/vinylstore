import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { Vinyl } from '../model/vinyl.model';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

jest.mock('../model/vinyl.model');
jest.mock('../utils/logger');

describe('VinylService', () => {
  let service: VinylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VinylService],
    }).compile();

    service = module.get<VinylService>(VinylService);
  });

  it('should create a new vinyl record', async () => {
    const createVinylDto = { name: 'Vinyl A', artist: 'Artist A', description: 'Description', price: 29.99, image: 'image-url' };
    const vinyl = { id: '1', ...createVinylDto } as Vinyl;
    jest.spyOn(Vinyl, 'create').mockResolvedValue(vinyl);

    const result = await service.create(createVinylDto);

    expect(result).toEqual(vinyl);
  });

  it('should throw error when vinyl creation fails', async () => {
    jest.spyOn(Vinyl, 'create').mockRejectedValue(new Error());

    await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
  });

  it('should retrieve a vinyl record by id', async () => {
    const vinyl = { id: '1', name: 'Vinyl A' } as Vinyl;
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(vinyl);

    const result = await service.findOne('1');
    expect(result).toEqual(vinyl);
  });

  it('should update a vinyl record', async () => {
    const vinyl = { id: '1', update: jest.fn() } as any;
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(vinyl);

    const updateDto = { name: 'Updated Name' };
    await service.update('1', updateDto);
    expect(vinyl.update).toHaveBeenCalledWith(updateDto);
  });

  it('should delete a vinyl record', async () => {
    const vinyl = { id: '1', destroy: jest.fn() } as any;
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(vinyl);

    await service.remove('1');
    expect(vinyl.destroy).toHaveBeenCalled();
  });

  it('should throw NotFoundException if vinyl to delete is not found', async () => {
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(null);

    await expect(service.remove('1')).rejects.toThrow(NotFoundException);
  });
});
