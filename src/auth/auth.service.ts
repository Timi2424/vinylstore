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

  async validateUser(req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') {
      systemLogger.warn('Authorization header missing or invalid');
      throw new Error('Authorization header missing or invalid');
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      systemLogger.warn('Bearer token missing');
      throw new Error('Bearer token missing');
    }
  
    try {
      const decoded = this.jwtService.verify(token);
      systemLogger.log(`JWT successfully verified: ${JSON.stringify(decoded)}`);
      return decoded;
    } catch (error) {
      systemLogger.error(`Token verification error: ${error.message}`, { error });
      throw new Error('Invalid token');
    }
  }
  
}
