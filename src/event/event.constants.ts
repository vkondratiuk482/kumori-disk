import { deepFreeze } from 'src/common/deep-freeze';

export const EVENT_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('EVENT_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
