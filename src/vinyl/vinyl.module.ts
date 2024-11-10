import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/db.module';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [VinylController],
    providers: [VinylService],
})
export class VinylModule {}
