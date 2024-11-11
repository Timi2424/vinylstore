import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../model/user.model';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('../model/user.model');

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find a user by Auth0 ID', async () => {
    const user = { auth0Id: 'auth0|123', email: 'test@example.com' } as User;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    const result = await service.findByAuth0Id('auth0|123');
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await expect(service.findByAuth0Id('auth0|123')).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException on database error when finding user', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'));

    await expect(service.findByAuth0Id('auth0|123')).rejects.toThrow(InternalServerErrorException);
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      auth0Id: 'auth0|123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };
    const user = { id: '1', ...createUserDto } as User;
    jest.spyOn(User, 'create').mockResolvedValue(user);

    const result = await service.create(createUserDto);
    expect(result).toEqual(user);
  });

  it('should throw InternalServerErrorException on database error when creating user', async () => {
    const createUserDto: CreateUserDto = {
      auth0Id: 'auth0|123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };
    jest.spyOn(User, 'create').mockRejectedValue(new Error('Database error'));

    await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
  });

  it('should update a user by Auth0 ID', async () => {
    const updateUserDto: UpdateUserDto = { firstName: 'Updated', lastName: 'User' };
    const user = { auth0Id: 'auth0|123', firstName: 'Test', lastName: 'User', update: jest.fn() } as any;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    await service.updateByAuth0Id('auth0|123', updateUserDto);
    expect(user.update).toHaveBeenCalledWith(updateUserDto);
  });

  it('should throw NotFoundException if user not found during update', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await expect(service.updateByAuth0Id('auth0|123', { firstName: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException on database error when updating user', async () => {
    const user = { auth0Id: 'auth0|123', update: jest.fn() } as any;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);
    user.update.mockRejectedValue(new Error('Database error'));

    await expect(service.updateByAuth0Id('auth0|123', { firstName: 'Updated' })).rejects.toThrow(InternalServerErrorException);
  });

  it('should delete a user by Auth0 ID', async () => {
    const user = { auth0Id: 'auth0|123', destroy: jest.fn() } as any;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    await service.removeByAuth0Id('auth0|123');
    expect(user.destroy).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found during deletion', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await expect(service.removeByAuth0Id('auth0|123')).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException on database error when deleting user', async () => {
    const user = { auth0Id: 'auth0|123', destroy: jest.fn() } as any;
    jest.spyOn(User, 'findOne').mockResolvedValue(user);
    user.destroy.mockRejectedValue(new Error('Database error'));

    await expect(service.removeByAuth0Id('auth0|123')).rejects.toThrow(InternalServerErrorException);
  });
});

