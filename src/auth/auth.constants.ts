import { deepFreeze } from 'src/common/deep-freeze';

export const AUTH_CONSTANTS = deepFreeze({
  APPLICATION: {},
  DOMAIN: {
    CONFIRMATION_HASH_TTL_SECONDS: 3600,
    CONFIRMATION_MAIL_SUBJECT:
      'Email confirmation for Kumori-Disk cloud storage service',
    CONFIRMATION_MAIL_BASE_TEXT:
      "You've signed up for Kumori-Disk cloud storage service, please follow the link to verify your email address",
  },
});
