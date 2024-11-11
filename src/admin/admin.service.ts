import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminService {
  private readonly systemLogPath = path.join(process.cwd(), 'logs', 'system.log');
  private readonly controllerLogPath = path.join(process.cwd(), 'logs', 'controller.log');

  readSystemLogs(): string {
    return this.readLogFile(this.systemLogPath);
  }

  readControllerLogs(): string {
    return this.readLogFile(this.controllerLogPath);
  }

  private readLogFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read log file: ${filePath}`);
    }
  }
}
