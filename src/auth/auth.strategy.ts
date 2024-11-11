import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';
import { systemLogger } from '../utils/logger';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(configService: ConfigService) {
    super({
      domain: configService.get<string>('AUTH0_DOMAIN'),
      clientID: configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    done: Function,
  ) {
    systemLogger.log('Validate function called with:');
    systemLogger.log(`accessToken: ${accessToken ? 'Received' : 'Not received'},`);
    systemLogger.log(`refreshToken: ${refreshToken ? 'Received' : 'Not received'},`);
    systemLogger.log(`extraParams: ${JSON.stringify(extraParams)}`);
    systemLogger.log(`Auth0 profile received: ${JSON.stringify(profile)}`);

    if (!profile || !profile.id || !profile.emails || profile.emails.length === 0) {
      const errorMessage = 'Invalid or incomplete profile data received from Auth0';
      systemLogger.error(errorMessage);
      return done(new UnauthorizedException(errorMessage), false);
    }

    try {
      const user = {
        auth0Id: profile.id,
        email: profile.emails[0]?.value || '',
        role: profile._json?.['https://vinylstore/roles']?.[0] || 'user',
      };
      systemLogger.log(`Validated user profile: ${JSON.stringify(user)}`);

      return done(null, user);
    } catch (error) {
      systemLogger.error(`Error validating user profile: ${error.message}`);
      return done(error, false);
    }
  }
}
