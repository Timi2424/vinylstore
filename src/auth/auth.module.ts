import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.strategy';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './serialization';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({session: true}),
    forwardRef(() => UserModule)
  ],
  providers: [JwtStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
