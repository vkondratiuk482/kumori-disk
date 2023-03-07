import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { TypeOrmFileRepository } from '../repositories/typeorm-file.repository';

export const FileRepositoryProvider: Provider = {
  useClass: TypeOrmFileRepository,
  provide: FILE_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
};
