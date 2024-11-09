import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';

const isDevEnv = process.env.NODE_ENV === 'development';

export const databaseProvider = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const dbName = configService.get<string>(
                isDevEnv ? 'DEV_DATABASE_NAME' : 'DATABASE_NAME',
            );
            const dbUser = configService.get<string>(
                isDevEnv ? 'DEV_DATABASE_USERNAME' : 'DATABASE_USERNAME',
            );
            const dbPassword = configService.get<string>(
                isDevEnv ? 'DEV_DATABASE_PASSWORD' : 'DATABASE_PASSWORD',
            );
            const dbHost = configService.get<string>(
                isDevEnv ? 'DEV_DATABASE_HOST' : 'DATABASE_HOST',
            );
            const dbPort = parseInt(
                configService.get<string>(
                    isDevEnv ? 'DEV_DATABASE_PORT' : 'DATABASE_PORT',
                ),
            );

            const sequelize = new Sequelize({
                database: dbName,
                username: dbUser,
                password: dbPassword,
                host: dbHost,
                port: dbPort,
                dialect: 'postgres',
                logging: isDevEnv ? false : console.log,
            });

            try {
                await sequelize.sync({ force: isDevEnv });
            } catch (error) {
                console.error('Sequelize sync error:', error);
            }

            return sequelize;
        },
        inject: [ConfigService],
    },
];
