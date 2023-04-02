import { Inject, Injectable } from '@nestjs/common';
import { FileError } from '../errors/file.error';
import { FILE_CONSTANTS } from '../file.constants';
import { FileConsumer } from '../enums/file-consumer.enum';
import { ICreateFile } from '../interfaces/create-file.interface';
import { IFileEntity } from '../interfaces/file-entity.interface';
import { IAttachTenant } from '../interfaces/attach-tenant.interface';
import { IDettachTenant } from '../interfaces/dettach-tenant.interface';
import { IFileRepository } from '../interfaces/file-repository.interface';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_CONSTANTS.APPLICATION.REPOSITORY_TOKEN)
    private readonly fileRepository: IFileRepository,
  ) {}

  public async findSingleByIdAndOwnerWithException(
    id: string,
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<IFileEntity> {
    const file = await this.fileRepository.findSingleById(id);

    if (!file) {
      throw FileError.NotFound();
    }

    const fileAccessible = this.fileAccessible(file, ownerId, ownerType);

    if (!fileAccessible) {
      throw FileError.NotAccessible();
    }

    return file;
  }

  public async findManyByIdsAndOwnerWithException(
    ids: string[],
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<IFileEntity[]> {
    const files = await this.fileRepository.findManyByIdsWithOwners(
      ids,
      ownerType,
    );

    for (const file of files) {
      const fileAccessible = this.fileAccessible(file, ownerId, ownerType);

      if (!fileAccessible) {
        throw FileError.NotAccessible();
      }
    }

    return files;
  }

  public async createSingle(data: ICreateFile): Promise<IFileEntity> {
    const file = await this.fileRepository.createSingle(data);

    return file;
  }

  public async updateKeyWithException(
    id: string,
    key: string,
  ): Promise<boolean> {
    const updated = await this.fileRepository.updateKey(id, key);

    return updated;
  }

  public async attachTenantWithException(
    data: IAttachTenant,
  ): Promise<boolean> {
    const attached = await this.fileRepository.attachTenant(data);

    return attached;
  }

  public async detachTenantWithException(
    data: IDettachTenant,
  ): Promise<boolean> {
    const dettached = await this.fileRepository.dettachTenant(data);

    return dettached;
  }

  private async fileAccessible(
    file: IFileEntity,
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<boolean> {
    if (file.ownerId !== ownerId && file.ownerType === ownerType) {
      return false;
    }

    return true;
  }
}
