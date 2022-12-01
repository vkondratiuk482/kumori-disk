import { CreateFile } from './create-file.interface';
import { AttachTenant } from './attach-tenant.interface';
import { DettachTenant } from './dettach-tenant.interface';
import { FileEntity } from './file-entity.interface';
import { FileConsumer } from '../enums/file-consumer.enum';

export interface FileRepository {
  findSingleById(id: string): Promise<FileEntity>;

  findManyByIdsWithOwners(
    ids: string[],
    ownerType: FileConsumer,
  ): Promise<FileEntity[]>;

  createSingle(data: CreateFile): Promise<FileEntity>;

  updateKey(id: string, key: string): Promise<boolean>;

  attachTenant(data: AttachTenant): Promise<boolean>;

  dettachTenant(data: DettachTenant): Promise<boolean>;
}
