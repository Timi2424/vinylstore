import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserType } from '../types/user.type';
import { systemLogger } from '../utils/logger';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user: UserType = request.user;

    if (user && user.role === 'admin') {
      systemLogger.log(`Access granted to admin user: ${user.email}`);
      return true;
    } else {
      systemLogger.warn(`Unauthorized access attempt by user: ${user ? user.email : 'Unknown'}`);
      throw new UnauthorizedException('Admin access only');
    }
  }
}
