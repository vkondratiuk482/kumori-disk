import { File } from './file.interface';

export interface FileServiceInterface {
  findSingleByUuid(uuid: string): Promise<File>;

  findSingleByName(name: string): Promise<File>;

  upload(file /* specify file interface */): Promise<boolean>;

  createSingleDirectory(path: string): Promise<boolean>;

  calculateFreeStorageSpaceByUserUuid(userUuid: string): Promise<string>;
}
