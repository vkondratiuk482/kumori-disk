import { deepFreeze } from 'src/common/deep-freeze';

export const TRANSACTION_CONSTANTS = deepFreeze({
  APPLICATION: {
    RUNNER_TOKEN: Symbol('TRANSACTION_RUNNER_TOKEN'),
    MANAGER_TOKEN: Symbol('TRANSACTION_MANAGER_TOKEN'),
  },
  DOMAIN: {},
});
