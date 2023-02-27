import { deepFreeze } from 'src/common/deep-freeze';

export const MAILER_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('MAILER_SERVICE_TOKEN'),
    NODEMAILER_TRANSPORTER_TOKEN: Symbol('NODEMAILER_TRANSPORTER_TOKEN'),
  },
  DOMAIN: {
    CONFIRMATION_SUBJECT:
      'Email confirmation for Kumori-Disk cloud storage service',
    CONFIRMATION_BASE_TEXT:
      "You've signed up for Kumori-Disk cloud storage service, please follow the link to verify your email address",
    GITHUB_GENERATED_PASSWORD_SUBJECT:
      'Auto generated password for Kumori-Disk cloud storage service',
    GITHUB_GENERATED_PASSWORD_BASE_TEXT:
      "You've signed up for Kumori-Disk cloud storage service using Github. We have generated password for you, please change it as soon as possible",
  },
});
