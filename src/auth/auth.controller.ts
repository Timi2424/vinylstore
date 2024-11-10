import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('login')
  @UseGuards(JwtAuthGuard)
  login() {}

  @Get('callback')
  @UseGuards(JwtAuthGuard)
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
