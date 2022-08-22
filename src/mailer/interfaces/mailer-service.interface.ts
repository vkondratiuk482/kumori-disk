import { SendMail } from './send-mail.interface';

export interface MailerServiceInterface {
  sendEmail(data: SendMail): Promise<void>;
}
