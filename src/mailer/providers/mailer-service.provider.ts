import { Provider } from '@nestjs/common';
import { MAILER_SERVICE_TOKEN } from '../mailer.constants';
import { MailerServiceImplementation } from '../mailer.service';

export const MailerServiceProvider: Provider = {
  provide: MAILER_SERVICE_TOKEN,
  useClass: MailerServiceImplementation,
};
