import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {}

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const token = await this.authService.generateJwtToken(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      maxAge: 3600000,
    });

    res.redirect('/profile');
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.redirect('/');
  }
}
