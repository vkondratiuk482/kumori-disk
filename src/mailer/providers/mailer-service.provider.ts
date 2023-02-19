import { Provider } from '@nestjs/common';
import { MAILER_CONSTANTS } from '../mailer.constants';
import { NodemailerMailerServiceImplementation } from '../nodemailer-mailer.service';

export const MailerServiceProvider: Provider = {
  useClass: NodemailerMailerServiceImplementation,
  provide: MAILER_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
