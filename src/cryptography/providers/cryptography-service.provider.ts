import { Provider } from '@nestjs/common';
import { CRYPTOGRAPHY_SERVICE_TOKEN } from '../cryptography.constants';
import { CryptographyServiceImplementation } from '../cryptography.service';

export const CryptographyServiceProvider: Provider = {
  provide: CRYPTOGRAPHY_SERVICE_TOKEN,
  useClass: CryptographyServiceImplementation,
};
