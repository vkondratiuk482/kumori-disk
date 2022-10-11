import { Readable } from 'node:stream';
import { UploadFile } from './upload-file.interface';

export interface FileServiceInterface {
  // findSingleByKey(key: string): Promise<File>;

  uploadWithException(userUuid: string, data: UploadFile): Promise<string>;

  downloadWithException(key: string): Promise<Readable>;

  // createSingleDirectory(path: string): Promise<boolean>;

  // calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
