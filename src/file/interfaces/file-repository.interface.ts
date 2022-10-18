import { File } from '../entities/file.entity';
import { CreateFile } from './create-file.interface';

export interface FileRepository {
  findManyByIds(ids: string[]): Promise<File[]>;
  createSingle(data: CreateFile): Promise<File>;
  saveMany(files: File[]): Promise<boolean>;
}
