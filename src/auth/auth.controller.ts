import { Controller, Get, Req, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { User } from '../model/user.model';
import { systemLogger } from '../utils/logger';
import { UserType } from 'src/types/user.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
      const auth0User = req.user as User;

      if (!auth0User) {
        systemLogger.error('User information missing in Auth0 callback');
        throw new HttpException('Auth0 user information missing', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const { auth0Id, email, firstName, lastName, avatar, } = auth0User;

      let user: UserType = await this.userService.findByAuth0Id(auth0Id);
      
      if (!user) {
        user = await this.userService.create({
          auth0Id,
          email,
          firstName,
          lastName,
          avatar,
          role: 'user',
        });
        systemLogger.log(`Created new user with email: ${email}`);
      } else {
        systemLogger.log(`User ${email} authenticated via Auth0`);
      }

      req.session.user = user;
      res.redirect('/api/user/profile');
    } catch (error) {
      systemLogger.error(`Auth0 callback error: ${error.message}`, { error });
      throw new HttpException('Callback Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Logout from the system' })
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) throw new Error('Logout failed');
      res.redirect('/api/auth/login');
    });
  }
}
