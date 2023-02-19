import { Provider } from '@nestjs/common';
import { CACHE_CONSTANTS } from '../cache.constants';
import { RedisCacheServiceImplementation } from '../redis-cache.service';

export const CacheServiceProvider: Provider = {
  useClass: RedisCacheServiceImplementation,
  provide: CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
