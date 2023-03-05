import { deepFreeze } from 'src/common/deep-freeze';

export const TRANSACTION_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('TRANSACTION_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
