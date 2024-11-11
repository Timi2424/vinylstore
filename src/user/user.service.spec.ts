import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../model/user.model';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

jest.mock('../model/user.model');
jest.mock('../utils/logger');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find a user by auth0Id', async () => {
    const user = { auth0Id: 'auth0|123', email: 'test@example.com' } as User;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    const result = await service.findByAuth0Id('auth0|123');
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await expect(service.findByAuth0Id('auth0|123')).rejects.toThrow(NotFoundException);
  });

  it('should create a user', async () => {
    const createUserDto = { auth0Id: 'auth0|123', email: 'test@example.com' };
    const user = { id: '1', ...createUserDto } as User;
    jest.spyOn(User, 'create').mockResolvedValue(user);

    const result = await service.create(createUserDto);
    expect(result).toEqual(user);
  });

  it('should throw error if user creation fails', async () => {
    jest.spyOn(User, 'create').mockRejectedValue(new Error());

    await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
  });
});
