import { Readable } from 'node:stream';
import { UploadGraphQLFile } from './upload-graphql-file.interface';

export interface FileService {
  // findSingleByKey(key: string): Promise<File>;

  uploadGraphQLWithException(
    userId: string,
    data: UploadGraphQLFile,
  ): Promise<string>;

  downloadWithException(key: string): Promise<Readable>;

  // createSingleDirectory(path: string): Promise<boolean>;

  // calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
