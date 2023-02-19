import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { FileFacadeImplementation } from '../file.facade';

export const FileFacadeProvider: Provider = {
  useClass: FileFacadeImplementation,
  provide: FILE_CONSTANTS.APPLICATION.FACADE_TOKEN,
};
