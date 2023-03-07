import { ISendMail } from './send-mail.interface';
import { ISendConfirmationMail } from './send-confirmation-mail.interface';
import { ISendGithubGeneratedPasswordMail } from './send-github-generated-password.interface';

export interface IMailerService {
  send(payload: ISendMail): Promise<void>;

  sendConfirmation(payload: ISendConfirmationMail): Promise<void>;

  sendGithubGeneratedPassword(
    payload: ISendGithubGeneratedPasswordMail,
  ): Promise<void>;
}
