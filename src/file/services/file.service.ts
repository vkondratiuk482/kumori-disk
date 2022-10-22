import { Inject, Injectable } from '@nestjs/common';
import { FileNotAccessibleError } from '../errors/file-not-accessible.error';
import { FILE_REPOSITORY_TOKEN } from '../constants/file.constants';
import { FileRepository } from '../interfaces/file-repository.interface';
import { CreateFile } from '../interfaces/create-file.interface';
import { File } from '../entities/file.entity';
import { AttachTenant } from '../interfaces/attach-tenant.interface';
import { FileConsumer } from '../enums/file-consumer.enum';
import { TenantNotAttachedError } from '../errors/tenant-not-attached.error';
import { DettachTenant } from '../interfaces/dettach-tenant.interface';
import { TenantNotDettachedError } from '../errors/tenant-not-dettached.error';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY_TOKEN)
    private readonly fileRepository: FileRepository,
  ) {}

  public async findManyByIdsAndOwnerWithException(
    ids: string[],
    ownerId: string,
    ownerType: FileConsumer,
  ): Promise<File[]> {
    const files = await this.fileRepository.findManyByIds(ids);

    for (const file of files) {
      if (file.ownerId !== ownerId && file.ownerType === ownerType) {
        throw new FileNotAccessibleError();
      }
    }

    return files;
  }

  public async createSingle(data: CreateFile): Promise<File> {
    const file = await this.fileRepository.createSingle(data);

    return file;
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

  public async saveMany(files: File[]): Promise<boolean> {
    const saved = await this.fileRepository.saveMany(files);

    return saved;
  }
}
