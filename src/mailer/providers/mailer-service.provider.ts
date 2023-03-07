import { Provider } from '@nestjs/common';
import { MAILER_CONSTANTS } from '../mailer.constants';
import { NodemailerMailerService } from '../nodemailer-mailer.service';

export const MailerServiceProvider: Provider = {
  useClass: NodemailerMailerService,
  provide: MAILER_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
