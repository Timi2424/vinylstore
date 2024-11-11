// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login via Auth0' })
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
    // Auth0 handles redirect, no additional logic needed here
  }

  @ApiOperation({ summary: 'Auth0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async callback(@Req() req: Request, @Res() res: Response) {
    // Extract basic user details
    const user = req.user as any;
    const token = this.authService.generateJwtToken(user);

    // Set JWT as an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    // Redirect after successful authentication
    res.redirect('/api/user/profile');
  }

  @ApiOperation({ summary: 'Logout' })
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.redirect('/api/login');
  }
}
