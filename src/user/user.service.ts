import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../model/user.model';
import { UserType } from '../types/user.type';
import { systemLogger } from '../utils/logger';

@Injectable()
export class UserService {
  async findByAuth0Id(auth0Id: string): Promise<UserType> {
    const user = await User.findOne({ where: { auth0Id } });
    if (!user) {
      systemLogger.warn(`User with Auth0 ID ${auth0Id} not found`);
      throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
    }
    return user.get({ plain: true }) as UserType;
  }

  async create(createUserDto: CreateUserDto): Promise<UserType> {
    try {
      const user = await User.create({
        ...createUserDto,
        birthdate: createUserDto.birthdate ? new Date(createUserDto.birthdate) : null,
      });
      systemLogger.log(`User with Auth0 ID ${user.auth0Id} created`);
      return user.get({ plain: true }) as UserType;
    } catch (error) {
      systemLogger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateByAuth0Id(auth0Id: string, updateUserDto: Partial<UpdateUserDto>): Promise<UserType> {
    const user = await User.findOne({ where: { auth0Id } });
    if (!user) {
      throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
    }

    try {
      await user.update({
        ...updateUserDto,
        birthdate: updateUserDto.birthdate ? new Date(updateUserDto.birthdate) : user.birthdate,
      });
      systemLogger.log(`User with Auth0 ID ${auth0Id} updated`);
      return user.get({ plain: true }) as UserType;
    } catch (error) {
      systemLogger.error(`Failed to update user with Auth0 ID ${auth0Id}`, error);
      throw new InternalServerErrorException(`Failed to update user with Auth0 ID ${auth0Id}`);
    }
  }

  async removeByAuth0Id(auth0Id: string): Promise<void> {
    const user = await User.findOne({ where: { auth0Id } });
    if (!user) {
      throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
    }

    try {
      await user.destroy();
      systemLogger.log(`User with Auth0 ID ${auth0Id} deleted`);
    } catch (error) {
      systemLogger.error(`Failed to delete user with Auth0 ID ${auth0Id}`, error);
      throw new InternalServerErrorException(`Failed to delete user with Auth0 ID ${auth0Id}`);
    }
  }
}


