import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { FileFacade } from '../file.facade';

export const FileFacadeProvider: Provider = {
  useClass: FileFacade,
  provide: FILE_CONSTANTS.APPLICATION.FACADE_TOKEN,
};
