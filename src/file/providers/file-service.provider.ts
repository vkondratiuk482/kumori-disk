import { Provider } from '@nestjs/common';
import { FILE_SERVICE_TOKEN } from '../constants/file.constants';
import {FileServiceImplementation} from '../file.service';

export const FileServiceProvider: Provider = {
  provide: FILE_SERVICE_TOKEN,
  useClass: FileServiceImplementation,
};
