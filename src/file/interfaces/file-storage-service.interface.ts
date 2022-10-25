import { Readable } from 'node:stream';
import { UploadFile } from './upload-file.interface';

export interface FileStorageService {
  getFileHierarchy(path: string): Promise<object>;

  getDirectoryHierarchy(path: string): Promise<object>;

  copySingle(soureFileKey: string, copyPath: string): Promise<boolean>;

  copyMany(sourceFileKeys: string[], copyPath: string): Promise<boolean>;

  renameSingle(key: string, name: string): Promise<boolean>;

  renameMany(keys: string[], name: string): Promise<boolean>;

  moveSingle(key: string, path: string): Promise<boolean>;

  moveMany(keys: string[], path: string): Promise<boolean>;

  list(path: string): Promise<object>;

  uploadSingleWithException(file: UploadFile): Promise<string>;

  uploadManyWithException(file: UploadFile[]): Promise<string[]>;

  downloadSingleWithException(key: string): Promise<Readable>;

  deleteOne(key: string): Promise<boolean>;
}
