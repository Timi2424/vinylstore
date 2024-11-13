import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Profile } from 'passport';
import { Strategy } from 'passport-auth0';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: false,
      session: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, extraParams: any, profile: Profile): Promise<any> {
    const user = await this.authService.validateUser(profile);
    if (!user) throw new Error('User not found');
    return user;
  }
}
