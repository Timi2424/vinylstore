import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import logger from '../utils/logger';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      debug: true,
    });

    this.transporter.verify((error, success) => {
      if (error) {
        logger.error('Email service initialization error:', error);
      } else {
        logger.log('Email service initialized successfully');
      }
    });
  }

  async sendProfileUpdatedEmail(user: { email: string; firstName: string }): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: user.email,
      subject: 'Profile Updated',
      text: `Hello ${user.firstName}, your profile has been updated successfully.`,
    };

    try {
      logger.log(`Sending email to ${user.email}...`);
      const info = await this.transporter.sendMail(mailOptions);
      logger.log(`Email sent: ${info.response}`);
    } catch (error) {
      logger.error(`Failed to send email: ${(error as Error).message}`);
    }
  }
}
