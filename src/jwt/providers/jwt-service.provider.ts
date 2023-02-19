import { Provider } from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { HS256JwtServiceImpl } from '../services/hs256-jwt.service';

export const JwtServiceProvider: Provider = {
  provide: JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
  useClass: HS256JwtServiceImpl,
};
