import { Provider } from '@nestjs/common';
import { UndiciHttpAdapter } from '../adapters/undici-http.adapter';
import { HTTP_CONSTANTS } from '../http.constants';

export const IHttpClientProvider: Provider = {
  useClass: UndiciHttpAdapter,
  provide: HTTP_CONSTANTS.APPLICATION.CLIENT_TOKEN,
};
