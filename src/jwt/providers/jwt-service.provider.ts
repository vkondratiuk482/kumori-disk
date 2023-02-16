import { Provider } from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { MokutekiJwtServiceImpl } from '../services/mokuteki-jwt.service';

export const JwtServiceProvider: Provider = {
  provide: JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
  useClass: MokutekiJwtServiceImpl,
};
