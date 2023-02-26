import { deepFreeze } from 'src/common/deep-freeze';

export const GITHUB_CONSTANTS = deepFreeze({
  APPLICATION: {
    CLIENT_TOKEN: Symbol('GITHUB_CLIENT_TOKEN'),
  },
  DOMAIN: {},
});
