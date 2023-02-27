import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MAILER_CONSTANTS } from './mailer.constants';
import { SendMail } from './interfaces/send-mail.interface';
import { MailerService } from './interfaces/mailer-service.interface';
import { SendConfirmationMail } from './interfaces/send-confirmation-mail.interface';
import { SendGithubGeneratedPasswordMail } from './interfaces/send-github-generated-password.interface';

@Injectable()
export class NodemailerMailerServiceImplementation implements MailerService {
  constructor(
    @Inject(MAILER_CONSTANTS.APPLICATION.NODEMAILER_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async send(payload: SendMail): Promise<void> {
    await this.transporter.sendMail(payload);
  }

  public async sendConfirmation(payload: SendConfirmationMail): Promise<void> {
    const subject = MAILER_CONSTANTS.DOMAIN.CONFIRMATION_SUBJECT;
    const text = `${MAILER_CONSTANTS.DOMAIN.CONFIRMATION_BASE_TEXT} - ${payload.link}`;

    await this.send({ text, subject, to: payload.receiver });
  }

  public async sendGithubGeneratedPassword(
    payload: SendGithubGeneratedPasswordMail,
  ): Promise<void> {
    const subject = MAILER_CONSTANTS.DOMAIN.GITHUB_GENERATED_PASSWORD_SUBJECT;
    const text = `${MAILER_CONSTANTS.DOMAIN.GITHUB_GENERATED_PASSWORD_BASE_TEXT} - ${payload.password}`;

    await this.send({ text, subject, to: payload.receiver });
  }
}
