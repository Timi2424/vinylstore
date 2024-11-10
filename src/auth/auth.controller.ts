import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import logger from 'src/utils/logger';
import { User } from 'src/types/user.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login via Auth0' })
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {}

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = await this.authService.generateJwtToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    logger.log(`User ${user.email} logged in`);
    res.redirect('/profile');
  }

  @ApiOperation({ summary: 'Logout from the system' })
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    logger.log('User logged out');
    res.redirect('/');
  }
}
