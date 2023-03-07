import { deepFreeze } from 'src/common/deep-freeze';

export const CACHE_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('CACHE_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
