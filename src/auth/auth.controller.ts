import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import logger from '../utils/logger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Login via Auth0' })
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {}

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    const auth0User = req.user as any;
    const auth0Id = auth0User.sub;
    const email = auth0User.email;

    let user = await this.userService.findByAuth0Id(auth0Id);
    if (!user) {
      user = await this.userService.create({
        auth0Id,
        email,
        firstName: auth0User.given_name,
        lastName: auth0User.family_name,
        avatar: auth0User.picture,
      });
      logger.log(`Created new user with email ${email}`);
    }

    const token = await this.authService.generateJwtToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    logger.log(`User ${email} logged in`);
    res.redirect('/user/profile');
  }

  @ApiOperation({ summary: 'Logout from the system' })
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    logger.log('User logged out');
    res.redirect('/auth/login');
  }
}
