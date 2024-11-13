import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth0Strategy } from './auth.strategy';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './serialization';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({session: true}),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, Auth0Strategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
