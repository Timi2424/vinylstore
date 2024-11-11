import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth0Strategy } from './auth.strategy';
import { UserModule } from '../user/user.module';
import { AdminGuard } from './admin.guard';
import { JwtAuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, Auth0Strategy, AdminGuard, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, AdminGuard, JwtAuthGuard],
})
export class AuthModule {}
