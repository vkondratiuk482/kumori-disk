import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MailerServiceInterface } from './interfaces/mailer-service.interface';
import { SendMail } from './interfaces/send-mail.interface';
import { MAILER_TRANSPORTER } from './mailer.constants';

@Injectable()
export class MailerService implements MailerServiceInterface {
  constructor(
    @Inject(MAILER_TRANSPORTER) private readonly transporter: Transporter,
  ) {}

  public async sendEmail(data: SendMail): Promise<void> {
    await this.transporter.sendMail(data);
  }
}
