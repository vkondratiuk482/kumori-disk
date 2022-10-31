import { Readable } from 'node:stream';
import { UploadFile } from './upload-file.interface';

export interface FileStorageService {
  getFileHierarchy(path: string): Promise<object>;

  getDirectoryHierarchy(path: string): Promise<object>;

  copySingleWithException(
    soureFileKey: string,
    copyPath: string,
  ): Promise<string>;

  copyMany(sourceFileKeys: string[], copyPath: string): Promise<boolean>;

  renameSingleWithException(key: string, name: string): Promise<string>;

  renameMany(keys: string[], name: string): Promise<boolean>;

  moveSingle(key: string, path: string): Promise<boolean>;

  moveMany(keys: string[], path: string): Promise<boolean>;

  list(path: string): Promise<object>;

  uploadSingleWithException(file: UploadFile): Promise<string>;

  uploadManyWithException(file: UploadFile[]): Promise<string[]>;

  downloadSingleWithException(key: string): Promise<Readable>;

  deleteOne(key: string): Promise<boolean>;
}
