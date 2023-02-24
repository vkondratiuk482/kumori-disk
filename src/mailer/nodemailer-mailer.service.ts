import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MAILER_CONSTANTS } from './mailer.constants';
import { SendMail } from './interfaces/send-mail.interface';
import { MailerService } from './interfaces/mailer-service.interface';

@Injectable()
export class NodemailerMailerServiceImplementation implements MailerService {
  constructor(
    @Inject(MAILER_CONSTANTS.APPLICATION.NODEMAILER_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async sendEmail(payload: SendMail): Promise<void> {
    await this.transporter.sendMail(payload);
  }
}
