import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { MailerServiceProvider } from './providers/mailer-service.provider';
import { MAILER_TRANSPORTER } from './mailer.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MAILER_TRANSPORTER,
      useFactory: (config: ConfigService): Transporter => {
        const transporter = createTransport({
          host: config.get<string>('MAILER_HOST'),
          port: config.get<number>('MAILER_PORT'),
          auth: {
            user: config.get<string>('MAILER_USERNAME'),
            pass: config.get<string>('MAILER_PASSWORD'),
          },
          from: config.get<string>('MAILER_USERNAME'),
        });

        return transporter;
      },
      inject: [ConfigService],
    },
    MailerServiceProvider,
  ],
  exports: [MailerServiceProvider],
})
export class MailerModule {}
