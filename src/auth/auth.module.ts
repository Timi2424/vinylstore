import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth0Strategy } from './auth.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, Auth0Strategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
