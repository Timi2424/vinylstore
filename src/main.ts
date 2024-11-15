import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { systemLogger, controllerLogger } from './utils/logger';
import { JwtService } from '@nestjs/jwt';
import passport from 'passport';
import session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use((req, res, next) => {
        const start = Date.now();
        const jwtService = app.get(JwtService);
        let userEmail = 'Guest';
        
        if (req.cookies && req.cookies.jwt) {
            try {
                const decodedToken = jwtService.verify(req.cookies.jwt);
                userEmail = decodedToken.email || 'Guest';
            } catch (error) {
                controllerLogger.warn('Invalid JWT token in request');
            }
        }

        res.on('finish', () => {
            const { method, originalUrl } = req;
            const { statusCode } = res;
            const responseTime = Date.now() - start;

            controllerLogger.log(`[${method}] ${originalUrl} - ${statusCode} ${responseTime}ms - User: ${userEmail}`);
        });

        next();
    });

    const sequelize = app.get<Sequelize>('SEQUELIZE');

    try {
        await sequelize.sync();
        systemLogger.log('Database synchronized successfully.');
    } catch (error) {
        systemLogger.error('Error synchronizing database:', error);
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
