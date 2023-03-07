import { Provider } from '@nestjs/common';
import { CACHE_CONSTANTS } from '../cache.constants';
import { RedisCacheService } from '../redis-cache.service';

export const CacheServiceProvider: Provider = {
  useClass: RedisCacheService,
  provide: CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
