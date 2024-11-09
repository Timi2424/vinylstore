import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const { combine, timestamp, printf, errors } = winston.format;

const logFilePath = path.join(process.cwd(), 'logs', 'combined.log');

const logger = WinstonModule.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFilePath }),
    ],
});

logger.log('error', (error) => {
    console.error('Logger error:', error);
});

export default logger;
