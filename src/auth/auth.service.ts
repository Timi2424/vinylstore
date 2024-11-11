import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import logger from '../utils/logger';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(user: any) {
    try {
      const payload = { sub: user.auth0Id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      logger.log(`JWT token generated for ${user.email}`);
      return token;
    } catch (error) {
      logger.error(`Failed to generate JWT token for ${user.email}`, { error });
      throw new HttpException('Token generation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(payload: any) {
    if (!payload || !payload.sub) {
      logger.warn('Invalid JWT payload for validation');
      throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
    }

    logger.log(`Validating user with email ${payload.email}`);
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
