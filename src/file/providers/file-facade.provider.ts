import { Provider } from '@nestjs/common';
import { FILE_FACADE_TOKEN } from '../constants/file.constants';
import { FileFacadeImplementation } from '../file.facade';

export const FileFacadeProvider: Provider = {
  provide: FILE_FACADE_TOKEN,
  useClass: FileFacadeImplementation,
};
