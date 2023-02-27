import { SendMail } from './send-mail.interface';
import { SendConfirmationMail } from './send-confirmation-mail.interface';
import { SendGithubGeneratedPasswordMail } from './send-github-generated-password.interface';

export interface MailerService {
  send(payload: SendMail): Promise<void>;

  sendConfirmation(payload: SendConfirmationMail): Promise<void>;

  sendGithubGeneratedPassword(
    payload: SendGithubGeneratedPasswordMail,
  ): Promise<void>;
}
