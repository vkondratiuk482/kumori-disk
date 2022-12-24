import { Provider } from '@nestjs/common';
import { UndiciHttpAdapter } from '../adapters/undici-http.adapter';
import { HTTP_SERVICE_TOKEN } from '../constants/http.constants';

export const HttpServiceProvider: Provider = {
  provide: HTTP_SERVICE_TOKEN,
  useClass: UndiciHttpAdapter,
};
