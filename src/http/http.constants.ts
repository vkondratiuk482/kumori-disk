import { deepFreeze } from 'src/common/deep-freeze';

export const HTTP_CONSTANTS = deepFreeze({
  APPLICATION: {
    CLIENT_TOKEN: Symbol('HTTP_CLIENT_TOKEN'),
  },
  DOMAIN: {},
});
