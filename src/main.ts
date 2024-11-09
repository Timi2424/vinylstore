import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize';
import logger from './utils/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env' });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const sequelize = app.get<Sequelize>('SEQUELIZE');

    try {
        await sequelize.sync();
        logger.log('Database synchronized successfully.');
    } catch (error) {
        logger.error('Error synchronizing database:', error);
        process.exit(1);
    }
    const config = new DocumentBuilder()
        .setTitle('Your API Title')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);

    app.use(cookieParser());
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
