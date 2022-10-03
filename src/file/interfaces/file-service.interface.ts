import { UploadFile } from './upload-file.interface';

export interface FileServiceInterface {
  // findSingleByKey(key: string): Promise<File>;

  uploadWithException(userUuid: string, data: UploadFile): Promise<string>;

  // createSingleDirectory(path: string): Promise<boolean>;

  // calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
