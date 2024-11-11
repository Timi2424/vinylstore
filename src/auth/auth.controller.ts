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
    try {
        systemLogger.log('Auth0 callback initiated');
        
        const auth0User = req.user as any;
        if (!auth0User) {
            systemLogger.error('User information is missing from Auth0');
            throw new Error("User information is missing from Auth0");
        }

        systemLogger.log(`Auth0 user data received: ${JSON.stringify(auth0User)}`);

        const auth0Id = auth0User.sub;
        const email = auth0User.email;

        let user = await this.userService.findByAuth0Id(auth0Id);
        if (!user) {
            systemLogger.log(`Creating new user for Auth0 ID ${auth0Id}`);
            user = await this.userService.create({
                auth0Id,
                email,
                firstName: auth0User.given_name,
                lastName: auth0User.family_name,
                avatar: auth0User.picture,
            });
            systemLogger.log(`Created new user with email ${email}`);
        } else {
            systemLogger.log(`User ${email} authenticated via Auth0`);
        }

        const token = await this.authService.generateJwtToken(user);
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });

        systemLogger.log(`JWT token generated and cookie set for ${email}`);
        res.redirect('/api/auth/callback');
    } catch (error) {
        systemLogger.error(`Auth0 callback error: ${error.message}`, { error });
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
