import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { NODEMAILER_TRANSPORTER } from '../mailer.constants';

export const NodemailerTransporterProvider: Provider = {
  provide: NODEMAILER_TRANSPORTER,
  useFactory: (config: ConfigService): Transporter => {
    const transporter = createTransport({
      host: config.get<string>('MAILER_HOST'),
      port: config.get<number>('MAILER_PORT'),
      auth: {
        user: config.get<string>('MAILER_USERNAME'),
        pass: config.get<string>('MAILER_PASSWORD'),
      },
      from: config.get<string>('MAILER_SENDER_NAME'),
    });

    return transporter;
  },
  inject: [ConfigService],
};
