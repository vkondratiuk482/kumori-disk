import { File } from './file.interface';

export interface FileServiceInterface {
  // findSingleByKey(key: string): Promise<File>;

  upload(userUuid: string, file: File): Promise<string>;

  // createSingleDirectory(path: string): Promise<boolean>;

  // calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
