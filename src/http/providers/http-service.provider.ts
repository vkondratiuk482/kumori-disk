import { Provider } from '@nestjs/common';
import { UndiciHttpAdapter } from '../adapters/undici-http.adapter';
import { HTTP_CONSTANTS } from '../http.constants';

export const HttpServiceProvider: Provider = {
  useClass: UndiciHttpAdapter,
  provide: HTTP_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
