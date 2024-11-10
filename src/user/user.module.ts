import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        JwtModule.register({
            secret: 'your-secret-key',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
