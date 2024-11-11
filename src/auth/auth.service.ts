import { Injectable } from '@nestjs/common';
import { systemLogger } from '../utils/logger';

@Injectable()
export class AuthService {
  async validateUser(profile: any) {
    const { sub: auth0Id, email } = profile;
    systemLogger.log(`Validating Auth0 user with ID: ${auth0Id} and email: ${email}`);
    return { auth0Id, email }
  }
}
