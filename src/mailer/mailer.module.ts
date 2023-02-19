import { Module } from '@nestjs/common';
import { MailerServiceProvider } from './providers/mailer-service.provider';
import { NodemailerTransporterProvider } from './providers/nodemailer-transporter.provider';

@Module({
  providers: [NodemailerTransporterProvider, MailerServiceProvider],
  exports: [MailerServiceProvider],
})
export class MailerModule {}
