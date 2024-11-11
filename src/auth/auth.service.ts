import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { systemLogger } from '../utils/logger';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(user: any) {
    try {
      const payload = { sub: user.auth0Id, email: user.email, role: user.role || 'user' };
      systemLogger.log(`Generating JWT with payload: ${JSON.stringify(payload)}`);
      
      const token = this.jwtService.sign(payload);
      systemLogger.log(`Generated JWT: ${token}`);
      
      return token;
    } catch (error) {
      systemLogger.error(`JWT generation error: ${error.message}`);
      throw error;
    }
  }

  async validateUser(token: any) {
    if (!token || typeof token !== 'string') {
      systemLogger.warn('Invalid token type or missing token');
      throw new JsonWebTokenError('JWT must be a string');
    }
  
    try {
      const decoded = this.jwtService.verify(token);
      systemLogger.log(`JWT successfully verified: ${JSON.stringify(decoded)}`);
      return decoded;
    } catch (error) {
      systemLogger.error(`Token verification error: ${error.message}`, { error });
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
