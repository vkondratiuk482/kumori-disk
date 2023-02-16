import { deepFreeze } from 'src/common/deep-freeze';

export const JWT_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('JWT_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
