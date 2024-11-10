import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { VinylModule } from './vinyl/vinyl.module';

@Module({
    imports: [
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        VinylModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
