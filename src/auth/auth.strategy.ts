import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { systemLogger } from '../utils/logger';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: false,
      scope: 'openid profile email',
      session: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, extraParams: any, profile: any): Promise<any> {
    const user = profile
    systemLogger.log(user);
    systemLogger.log(user);
    systemLogger.log(user);
    systemLogger.log(user);
    systemLogger.log(user);
    if (!user) throw new Error('User not found');
    return user;
  }
}
