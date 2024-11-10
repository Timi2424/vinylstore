import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { Request } from 'express';
  import { JwtAuthGuard } from '../auth/auth.guard';
  
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(private readonly usersService: UserService) {}
  
    @ApiOperation({ summary: 'Get user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request) {
      const userId = req.user['sub'];
      return this.usersService.findById(userId);
    }
  
    @ApiOperation({ summary: 'Update user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(
      @Req() req: Request,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      const userId = req.user['sub'];
      return this.usersService.update(userId, updateUserDto);
    }
  
    @ApiOperation({ summary: 'Delete user profile' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('profile')
    async deleteProfile(@Req() req: Request) {
      const userId = req.user['sub'];
      await this.usersService.remove(userId);
      return { message: 'User profile deleted successfully' };
    }
  }
  