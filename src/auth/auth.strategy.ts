import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { AuthService } from './auth.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, extraParams: any, profile: any): Promise<any> {
    try {
      const user = await this.authService.validateUser(profile);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
