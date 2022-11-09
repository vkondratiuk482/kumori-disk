import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MailerService } from './interfaces/mailer-service.interface';
import { SendMail } from './interfaces/send-mail.interface';
import { NODEMAILER_TRANSPORTER } from './mailer.constants';

@Injectable()
export class NodemailerMailerServiceImplementation implements MailerService {
  constructor(
    @Inject(NODEMAILER_TRANSPORTER) private readonly transporter: Transporter,
  ) {}

  public async sendEmail(data: SendMail): Promise<void> {
    await this.transporter.sendMail(data);
  }
}
