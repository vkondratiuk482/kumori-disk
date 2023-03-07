import { deepFreeze } from 'src/common/deep-freeze';

export const CRYPTOGRAPHY_CONSTANTS = deepFreeze({
  APPLICATION: {
    SERVICE_TOKEN: Symbol('CRYPTOGRAPHY_SERVICE_TOKEN'),
  },
  DOMAIN: {
    HASH_KEYLEN: 32,
    HASH_SEPARATOR: ';',
  },
});
