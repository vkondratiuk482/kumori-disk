import { SendMail } from './send-mail.interface';

export interface MailerService {
  sendEmail(data: SendMail): Promise<void>;
}
