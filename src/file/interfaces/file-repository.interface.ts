import { ICreateFile } from './create-file.interface';
import { IAttachTenant } from './attach-tenant.interface';
import { IDettachTenant } from './dettach-tenant.interface';
import { IFileEntity } from './file-entity.interface';
import { FileConsumer } from '../enums/file-consumer.enum';

export interface IFileRepository {
  findSingleById(id: string): Promise<IFileEntity>;

  findManyByIdsWithOwners(
    ids: string[],
    ownerType: FileConsumer,
  ): Promise<IFileEntity[]>;

  createSingle(data: ICreateFile): Promise<IFileEntity>;

  updateKey(id: string, key: string): Promise<boolean>;

  attachTenant(data: IAttachTenant): Promise<boolean>;

  dettachTenant(data: IDettachTenant): Promise<boolean>;
}
