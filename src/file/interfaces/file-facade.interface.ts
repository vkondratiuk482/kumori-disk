import { File } from '../entities/file.entity';
import { UploadFile } from './upload-file.interface';

export interface FileFacade {
  uploadSingleFileWithException(data: UploadFile): Promise<string>;

  findManyByIdsAndOwnerIdInDatabaseWithException(
    ids: string[],
    ownerId: string,
  ): Promise<File[]>;

  saveManyInDatabase(files: File[]): Promise<boolean>;
}
