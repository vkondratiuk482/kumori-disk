import { Provider } from '@nestjs/common';
import { CRYPTOGRAPHY_CONSTANTS } from '../cryptography.constants';
import { NativeCryptoCryptographyServiceImplementation } from '../native-crypto-cryptography.service';

export const CryptographyServiceProvider: Provider = {
  useClass: NativeCryptoCryptographyServiceImplementation,
  provide: CRYPTOGRAPHY_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
