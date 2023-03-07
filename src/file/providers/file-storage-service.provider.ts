import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { S3FileStorageService } from '../services/s3-file-storage.service';

export const FileStorageServiceProvider: Provider = {
  useClass: S3FileStorageService,
  provide: FILE_CONSTANTS.APPLICATION.STORAGE_SERVICE_TOKEN,
};
