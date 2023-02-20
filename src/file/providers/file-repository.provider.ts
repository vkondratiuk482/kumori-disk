import { Provider } from '@nestjs/common';
import { FILE_CONSTANTS } from '../file.constants';
import { TypeOrmFileRepositoryImplementation } from '../repositories/typeorm-file.repository';

export const FileRepositoryProvider: Provider = {
  useClass: TypeOrmFileRepositoryImplementation,
  provide: FILE_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
};
