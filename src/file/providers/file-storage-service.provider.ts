import { Provider } from '@nestjs/common';
import { FILE_STORAGE_SERVICE_TOKEN } from '../constants/file.constants';
import { S3FileStorageServiceImplementation } from '../services/s3-file-storage.service';

export const FileStorageServiceProvider: Provider = {
  provide: FILE_STORAGE_SERVICE_TOKEN,
  useClass: S3FileStorageServiceImplementation,
};
