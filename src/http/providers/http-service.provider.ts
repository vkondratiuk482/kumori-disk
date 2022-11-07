import { Provider } from '@nestjs/common';
import { HTTP_SERVICE_TOKEN } from '../constants/http.constants';
import { UndiciHttpServiceImplementation } from '../undici-http.service';

export const HttpServiceProvider: Provider = {
  provide: HTTP_SERVICE_TOKEN,
  useClass: UndiciHttpServiceImplementation,
};
