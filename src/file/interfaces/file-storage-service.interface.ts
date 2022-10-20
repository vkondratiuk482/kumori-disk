import { Readable } from 'node:stream';
import { UploadFile } from './upload-file.interface';

export interface FileStorageService {
  uploadSingleWithException(file: UploadFile): Promise<string>;

  uploadManyWithException(file: UploadFile[]): Promise<string[]>;

  downloadSingleWithException(key: string): Promise<Readable>;

  deleteOne(key: string): Promise<boolean>;
}
