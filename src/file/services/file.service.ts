import { Inject, Injectable } from '@nestjs/common';
import { FileNotAccessibleError } from '../errors/file-not-accessible.error';
import { FILE_REPOSITORY_TOKEN } from '../constants/file.constants';
import { FileRepository } from '../interfaces/file-repository.interface';
import { CreateFile } from '../interfaces/create-file.interface';
import { AttachTenant } from '../interfaces/attach-tenant.interface';
import { FileConsumer } from '../enums/file-consumer.enum';
import { TenantNotAttachedError } from '../errors/tenant-not-attached.error';
import { DettachTenant } from '../interfaces/dettach-tenant.interface';
import { TenantNotDettachedError } from '../errors/tenant-not-dettached.error';
import { FileNotFoundError } from '../errors/file-not-found.error';
import { FileEntity } from '../interfaces/file-entity.interface';
import { FileKeyNotUpdatedInDatabaseError } from '../errors/file-key-not-updated-in-database.error';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY_TOKEN)
    private readonly fileRepository: FileRepository,
  ) {}

  public async findSingleByIdAndOwnerWithException(
    id: string,
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<FileEntity> {
    const file = await this.fileRepository.findSingleById(id);

    if (!file) {
      throw new FileNotFoundError();
    }

    const fileAccessible = this.fileAccessible(file, ownerId, ownerType);

    if (!fileAccessible) {
      throw new FileNotAccessibleError();
    }

    return file;
  }

  public async findManyByIdsAndOwnerWithException(
    ids: string[],
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<FileEntity[]> {
    const files = await this.fileRepository.findManyByIdsWithOwners(
      ids,
      ownerType,
    );

    for (const file of files) {
      const fileAccessible = this.fileAccessible(file, ownerId, ownerType);

      if (!fileAccessible) {
        throw new FileNotAccessibleError();
      }
    }

    return files;
  }

  public async createSingle(data: CreateFile): Promise<FileEntity> {
    const file = await this.fileRepository.createSingle(data);

    return file;
  }

  public async updateKeyWithException(
    id: string,
    key: string,
  ): Promise<boolean> {
    const updated = await this.fileRepository.updateKey(id, key);

    if (!updated) {
      throw new FileKeyNotUpdatedInDatabaseError();
    }

    return updated;
  }

  public async attachTenantWithException(data: AttachTenant): Promise<boolean> {
    const attached = await this.fileRepository.attachTenant(data);

    if (!attached) {
      throw new TenantNotAttachedError();
    }

    return attached;
  }

  public async detachTenantWithException(
    data: DettachTenant,
  ): Promise<boolean> {
    const dettached = await this.fileRepository.dettachTenant(data);

    if (!dettached) {
      throw new TenantNotDettachedError();
    }

    return dettached;
  }

  private async fileAccessible(
    file: FileEntity,
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<boolean> {
    if (file.ownerId !== ownerId && file.ownerType === ownerType) {
      return false;
    }

    return true;
  }
}
