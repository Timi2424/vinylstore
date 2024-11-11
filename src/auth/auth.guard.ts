import {
    Injectable,
    CanActivate,
    ExecutionContext,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { systemLogger } from '../utils/logger';

  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.cookies['jwt'];
  
      if (!token) {
        systemLogger.warn('JWT token not found');
        return false;
      }
  
      try {
        const decoded = this.jwtService.verify(token);
        request['user'] = decoded;
        systemLogger.log(`JWT token verified for ${decoded.email}`);
        return true;
      } catch (error) {
        systemLogger.error('Token verification failed', error);
        return false;
      }
    }
  }
  
