import { Controller, Get, Patch, Delete, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    try {
      const auth0Id = req.user['sub'];
      const user = await this.usersService.findByAuth0Id(auth0Id);
      return { statusCode: HttpStatus.OK, data: user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    try {
      const auth0Id = req.user['sub'];
      const updatedUser = await this.usersService.updateByAuth0Id(auth0Id, updateUserDto);
      return { statusCode: HttpStatus.OK, message: 'Profile updated successfully', data: updatedUser };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
    try {
      const auth0Id = req.user['sub'];
      await this.usersService.removeByAuth0Id(auth0Id);
      return { statusCode: HttpStatus.NO_CONTENT, message: 'User profile deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
