import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
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
    const auth0Id = req.user['sub'];
    return this.usersService.findByAuth0Id(auth0Id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const auth0Id = req.user['sub'];
    return this.usersService.updateByAuth0Id(auth0Id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request) {
    const auth0Id = req.user['sub'];
    await this.usersService.removeByAuth0Id(auth0Id);
    return { message: 'User profile deleted successfully' };
  }
}

