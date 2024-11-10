import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import logger from 'src/utils/logger';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['jwt'];

        if (!token) {
            return false;
        }

        try {
            const decoded = this.jwtService.verify(token);
            request['user'] = decoded;
            return true;
        } catch (error) {
            logger.log(error);  
            return false;
        }
    }
}
