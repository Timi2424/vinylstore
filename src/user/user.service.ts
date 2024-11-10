import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/model/user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: ['reviews', 'purchasedVinylRecords'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateData: UpdateUserDto): Promise<User> {
    const [numberOfAffectedRows, [updatedUser]] = await this.userModel.update(
      { ...updateData },
      { where: { id }, returning: true },
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
