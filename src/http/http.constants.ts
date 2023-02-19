import { deepFreeze } from 'src/common/deep-freeze';

export const HTTP_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('HTTP_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
