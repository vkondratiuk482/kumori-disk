import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerServiceProvider } from './providers/mailer-service.provider';
import { NodemailerTransporterProvider } from './providers/nodemailer-transporter.provider';

@Module({
  imports: [ConfigModule],
  providers: [NodemailerTransporterProvider, MailerServiceProvider],
  exports: [MailerServiceProvider],
})
export class MailerModule {}
