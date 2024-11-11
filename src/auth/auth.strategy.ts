import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../types/user.type';
import { systemLogger } from 'src/utils/logger';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(configService: ConfigService) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const clientID = configService.get<string>('AUTH0_CLIENT_ID');
    const clientSecret = configService.get<string>('AUTH0_CLIENT_SECRET');
    const callbackURL = configService.get<string>('AUTH0_CALLBACK_URL');
    
    super({
      domain,
      clientID,
      clientSecret,
      callbackURL,
      state: false,
    });

 
    systemLogger.log(`Auth0Strategy initialized with:
      domain: ${domain},
      clientID: ${clientID},
      callbackURL: ${callbackURL}`);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    done: Function,
  ) {
    systemLogger.log(`Validate function called with:
      accessToken: ${accessToken ? 'Received' : 'Not received'},
      refreshToken: ${refreshToken ? 'Received' : 'Not received'},
      extraParams: ${JSON.stringify(extraParams)}`);
    
    systemLogger.log(`Auth0 profile received: ${JSON.stringify(profile)}`);

    try {
      const user: UserType = {
        auth0Id: profile.id,
        email: profile.emails[0]?.value,
        role: profile._json?.['https://your-app.com/roles']?.[0] || 'user',
      };

      if (!user.email) {
        systemLogger.error('Email not found in Auth0 profile.');
        throw new Error('Email not found in profile.');
      }

      systemLogger.log(`Validated user profile for email: ${user.email}`);
      done(null, user);
    } catch (err) {
      systemLogger.error(`Error validating user profile: ${err.message}`);
      done(err, false);
    }
  }
}
