import { Provider } from '@nestjs/common';
import { CRYPTOGRAPHY_CONSTANTS } from '../cryptography.constants';
import { CryptographyService } from '../cryptography.service';

export const CryptographyServiceProvider: Provider = {
  useClass: CryptographyService,
  provide: CRYPTOGRAPHY_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
