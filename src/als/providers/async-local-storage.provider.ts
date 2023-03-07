import { Provider } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export const AsyncLocalStorageProvider: Provider = {
  provide: AsyncLocalStorage,
  useValue: new AsyncLocalStorage(),
};
