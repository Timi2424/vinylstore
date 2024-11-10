import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import logger from '../utils/logger';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  
  async generateJwtToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    logger.log(`Token generated for ${user.email}`);
    return token;
  }

  async validateUser(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
