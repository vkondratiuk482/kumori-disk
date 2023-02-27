import { deepFreeze } from 'src/common/deep-freeze';

export const AUTH_CONSTANTS = deepFreeze({
  APPLICATION: {},
  DOMAIN: {
    CONFIRMATION_HASH_TTL_SECONDS: 3600,
  },
});
