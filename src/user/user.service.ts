import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';

  import { UpdateUserDto } from './dto/update-user.dto';
  import logger from 'src/utils/logger';
import { User } from 'src/model/user.model';
  
  @Injectable()
  export class UserService {
    async findById(id: string): Promise<User> {
      const user = await User.findByPk(id);
      if (!user) {
        logger.warn(`User with id ${id} not found`);
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    }
  
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.findById(id);
      try {
        await user.update(updateUserDto);
        logger.log(`User with id ${id} updated`);
        return user;
      } catch (error) {
        logger.error(`Failed to update user with id ${id}`, error);
        throw new InternalServerErrorException(
          `Failed to update user with id ${id}`,
        );
      }
    }
  
    async remove(id: string): Promise<void> {
      const user = await this.findById(id);
      try {
        await user.destroy();
        logger.log(`User with id ${id} deleted`);
      } catch (error) {
        logger.error(`Failed to delete user with id ${id}`, error);
        throw new InternalServerErrorException(
          `Failed to delete user with id ${id}`,
        );
      }
    }
  }
  