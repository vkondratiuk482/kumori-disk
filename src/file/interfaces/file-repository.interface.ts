import { CreateFile } from './create-file.interface';
import { AttachTenant } from './attach-tenant.interface';
import { DettachTenant } from './dettach-tenant.interface';
import { FileEntity } from './file-entity.interface';

export interface FileRepository {
  findSingleById(id: string): Promise<FileEntity>;

  findManyByIds(ids: string[]): Promise<FileEntity[]>;

  createSingle(data: CreateFile): Promise<FileEntity>;

  updateKey(id: string, key: string): Promise<boolean>;

  attachTenant(data: AttachTenant): Promise<boolean>;

  dettachTenant(data: DettachTenant): Promise<boolean>;
}
