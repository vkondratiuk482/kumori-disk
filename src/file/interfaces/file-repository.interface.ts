import { File } from '../entities/file.entity';
import { CreateFile } from './create-file.interface';
import { AttachTenant } from './attach-tenant.interface';
import { DettachTenant } from './dettach-tenant.interface';

export interface FileRepository {
  findManyByIds(ids: string[]): Promise<File[]>;

  createSingle(data: CreateFile): Promise<File>;

  attachTenant(data: AttachTenant): Promise<boolean>;

  dettachTenant(data: DettachTenant): Promise<boolean>;

  saveMany(files: File[]): Promise<boolean>;
}
