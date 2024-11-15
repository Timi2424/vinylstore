import { Test, TestingModule } from '@nestjs/testing';
import { VinylService } from './vinyl.service';
import { Vinyl } from '../model/vinyl.model';
import { Review } from '../model/review.model';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';

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

  it('should throw NotFoundException if vinyl to retrieve by id is not found', async () => {
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update a vinyl record', async () => {
    const vinyl = { id: '1', update: jest.fn() } as any;
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(vinyl);

    const updateDto = { name: 'Updated Name' };
    await service.update('1', updateDto);
    expect(vinyl.update).toHaveBeenCalledWith(updateDto);
  });

  it('should throw NotFoundException if vinyl to update is not found', async () => {
    jest.spyOn(Vinyl, 'findByPk').mockResolvedValue(null);

    await expect(service.update('1', { name: 'Updated Name' })).rejects.toThrow(NotFoundException);
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

  it('should retrieve paginated vinyl records with sorting and filtering', async () => {
    const vinyls = {
      rows: [
        { id: '1', name: 'Vinyl A', artist: 'Artist A', description: 'Description', price: 29.99 } as Vinyl,
        { id: '2', name: 'Vinyl B', artist: 'Artist B', description: 'Description', price: 19.99 } as Vinyl,
      ],
      count: [{ count: 2 }],
    };

    jest.spyOn(Vinyl, 'findAndCountAll').mockResolvedValue(vinyls as any);

    expect(Vinyl.findAndCountAll).toHaveBeenCalledWith({
      where: {
        name: { [Op.iLike]: '%Vinyl%' },
        artist: { [Op.iLike]: '%Artist%' },
      },
      include: [
        {
          model: Review,
          attributes: [[expect.any(Function), 'averageScore']],
        },
      ],
      offset: 0,
      limit: 10,
      order: [['price', 'ASC']],
      distinct: true,
    });
  });

  it('should throw InternalServerErrorException when findAll fails', async () => {
    jest.spyOn(Vinyl, 'findAndCountAll').mockRejectedValue(new Error());

    await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
  });
});
