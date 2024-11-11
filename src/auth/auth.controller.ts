import { Controller, Get, Req, Res, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
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
  login() {
    logger.log('Redirecting to Auth0 for login');
  }

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
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
      } else {
        logger.log(`User ${email} authenticated via Auth0`);
      }

      const token = await this.authService.generateJwtToken(user);

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });

      logger.log(`JWT token generated for ${email}`);
      res.redirect('/api/user/profile');
    } catch (error) {
      logger.error(`Auth0 callback error: ${error.message}`, { error });
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Logout from the system' })
  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      res.clearCookie('jwt');
      logger.log('User logged out and JWT cookie cleared');
      res.redirect('/api/login');
    } catch (error) {
      logger.error(`Logout error: ${error.message}`, { error });
      throw new HttpException('Failed to log out', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
