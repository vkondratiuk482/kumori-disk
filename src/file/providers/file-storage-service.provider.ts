import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { S3FileStorageServiceImplementation } from '../services/s3-file-storage.service';

export const FileStorageServiceProvider: Provider = {
  useClass: S3FileStorageServiceImplementation,
  provide: FILE_CONSTANTS.APPLICATION.STORAGE_SERVICE_TOKEN,
};
