import { Readable } from 'node:stream';
import { ShareAccess } from './share-access.interface';
import { UploadGraphQLFile } from './upload-graphql-file.interface';

export interface FileService {
  // findSingleByKey(key: string): Promise<File>;

  uploadGraphQLWithException(
    userId: string,
    data: UploadGraphQLFile,
  ): Promise<string>;

  shareAccessWithException(
    ownerId: string,
    data: ShareAccess,
  ): Promise<boolean>;

  downloadWithException(key: string): Promise<Readable>;

  // createSingleDirectory(path: string): Promise<boolean>;

  // calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
