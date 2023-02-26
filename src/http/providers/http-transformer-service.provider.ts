import { Provider } from '@nestjs/common';
import { HTTP_CONSTANTS } from '../http.constants';
import { NativeHttpTransformerServiceImpl } from '../services/native-http-transformer.service';

export const HttpTransformerServiceProvider: Provider = {
  useClass: NativeHttpTransformerServiceImpl,
  provide: HTTP_CONSTANTS.APPLICATION.TRANSFORMER_SERVICE_TOKEN,
};
