import { Controller, Get, Req, Res, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { systemLogger } from '../utils/logger';

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
    systemLogger.log('Initiating Auth0 login redirect');
  }

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    systemLogger.log('Auth0 callback initiated');

    // Step 1: Verify Auth0 response user data
    const auth0User = req.user as any;
    if (!auth0User) {
      return this.logAndThrowError('User information is missing from Auth0', HttpStatus.UNAUTHORIZED);
    }
    systemLogger.log(`Auth0 user data received: ${JSON.stringify(auth0User)}`);

    const { sub: auth0Id, email, given_name: firstName, family_name: lastName, picture: avatar } = auth0User;

    // Step 2: Check or create user in the local database
    let user;
    try {
      user = await this.userService.findByAuth0Id(auth0Id);
      if (!user) {
        systemLogger.log(`No user found for Auth0 ID ${auth0Id}, creating new user`);
        user = await this.userService.create({ auth0Id, email, firstName, lastName, avatar });
        systemLogger.log(`Created new user with email ${email}`);
      } else {
        systemLogger.log(`User ${email} authenticated via Auth0`);
      }
    } catch (dbError) {
      return this.logAndThrowError(`Database error: ${dbError.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Step 3: Generate and set JWT token
    try {
      const token = await this.authService.generateJwtToken(user);
      this.setJwtCookie(res, token, email);
      systemLogger.log(`JWT token generated and cookie set for ${email}`);
      res.redirect('/api/user/profile');
    } catch (tokenError) {
      return this.logAndThrowError(`JWT generation or cookie setting error: ${tokenError.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private setJwtCookie(res: Response, token: string, email: string) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
    systemLogger.log(`JWT token cookie set for ${email}`);
  }

  private logAndThrowError(message: string, status: HttpStatus): never {
    systemLogger.error(message);
    throw new HttpException(message, status);
  }

  @ApiOperation({ summary: 'Logout from the system' })
  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      res.clearCookie('jwt');
      systemLogger.log('User successfully logged out and JWT cookie cleared');
      res.redirect('/api/auth/login');
    } catch (error) {
      systemLogger.error(`Logout error: ${error.message}`, { errorStack: error.stack });
      throw new HttpException('Failed to log out', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
