import { Provider } from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { RS256JwtServiceImpl } from '../services/rs256-jwt.service';

export const JwtServiceProvider: Provider = {
  useClass: RS256JwtServiceImpl,
  provide: JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
