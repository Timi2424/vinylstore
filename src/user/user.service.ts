import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../model/user.model';
import { UserType } from '../types/user.type';
import { systemLogger } from '../utils/logger';
import { Review } from '../model/review.model';
import { Vinyl } from '../model/vinyl.model';

@Injectable()
export class UserService {
  async findByAuth0Id(auth0Id: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: { auth0Id },
        include: [
          { model: Review, as: 'reviews' },
          { model: Vinyl, as: 'purchasedVinylRecords' }
        ],
      });

      if (!user) {
        systemLogger.warn(`User with Auth0 ID ${auth0Id} not found`);
        throw new NotFoundException(`User with Auth0 ID ${auth0Id} not found`);
      }
      return user;
    } catch (error) {
      systemLogger.error(`Error fetching user profile for Auth0 ID ${auth0Id}`, error);
      throw new InternalServerErrorException('Failed to retrieve user profile');
    }
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


