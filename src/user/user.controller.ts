import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { AuthGuard } from '@nestjs/passport';
  import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller('user')
  @UseGuards(AuthGuard('jwt'))
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get('profile')
    async getProfile(@Req() req: Request) {
      const userId = req.user['id'];
      return this.userService.findOne(userId);
    }
  
    @Put('profile')
    async updateProfile(
      @Req() req: Request,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      const userId = req.user['id'];
      return this.userService.update(userId, updateUserDto);
    }
  
    @Delete('profile')
    async deleteProfile(@Req() req: Request) {
      const userId = req.user['id'];
      await this.userService.remove(userId);
      return { message: 'User profile deleted successfully' };
    }
  }
  