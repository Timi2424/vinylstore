import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize';
import logger from './utils/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

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

    app.setGlobalPrefix('api');
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, 
        {useGlobalPrefix: true} );

    app.use(cookieParser());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
