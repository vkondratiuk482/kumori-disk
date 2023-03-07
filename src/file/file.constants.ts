import { deepFreeze } from 'src/common/deep-freeze';

export const FILE_CONSTANTS = deepFreeze({
  APPLICATION: {
    FACADE_TOKEN: Symbol('FILE_FACADE_TOKEN'),
    S3_CLIENT_TOKEN: Symbol('S3_CLIENT_TOKEN'),
    REPOSITORY_TOKEN: Symbol('FILE_REPOSITORY_TOKEN'),
    STORAGE_SERVICE_TOKEN: Symbol('FILE_STORAGE_SERVICE_TOKEN'),
  },
  DOMAIN: {},
});
