import { deepFreeze } from 'src/common/deep-freeze';

export const MAILER_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('MAILER_SERVICE_TOKEN'),
    NODEMAILER_TRANSPORTER_TOKEN: Symbol('NODEMAILER_TRANSPORTER_TOKEN'),
  },
  DOMAIN: {},
});
