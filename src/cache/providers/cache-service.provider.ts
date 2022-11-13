import { Provider } from '@nestjs/common';
import { CACHE_SERVICE_TOKEN } from '../constants/cache.constants';
import { RedisCacheServiceImplementation } from '../redis-cache.service';

export const CacheServiceProvider: Provider = {
  provide: CACHE_SERVICE_TOKEN,
  useClass: RedisCacheServiceImplementation,
};
