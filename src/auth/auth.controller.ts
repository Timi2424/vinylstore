import { Controller, Get, Req, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { systemLogger } from '../utils/logger';
import { UserType } from 'src/types/user.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Login via Auth0' })
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
  }
  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
      const auth0User = req.user as any;

      if (!auth0User || !auth0User.sub || !auth0User.email) {
        systemLogger.error('User information missing in Auth0 callback');
        throw new HttpException('Auth0 user information missing', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const auth0Id = auth0User.sub;
      const email = auth0User.email;

      let user: Partial<UserType> = await this.userService.findByAuth0Id(auth0Id);
      if (!user) {
        systemLogger.log(`Creating new user for Auth0 ID ${auth0Id}`);
        user = await this.userService.create({
          auth0Id,
          email,
          firstName: auth0User.given_name || '',
          lastName: auth0User.family_name || '',
          avatar: auth0User.picture || '',
        });
        systemLogger.log(`New user created with email ${email}`);
      } else {
        systemLogger.log(`User ${email} authenticated via Auth0`);
      }
      req.session.user = { id: user.id, email: user.email };
      systemLogger.log(`Session created for user: ${email}`);

      res.redirect('/api/user/profile');
    } catch (error) {
      systemLogger.log(`Auth0 callback error: ${error.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
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
