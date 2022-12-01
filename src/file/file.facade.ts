import { Inject, Injectable } from '@nestjs/common';
import { UploadFile } from './interfaces/upload-file.interface';
import { FileFacade } from './interfaces/file-facade.interface';
import { FileStorageService } from './interfaces/file-storage-service.interface';
import { FILE_STORAGE_SERVICE_TOKEN } from './constants/file.constants';
import { FileService } from './services/file.service';
import { ShareAccess } from 'src/file/interfaces/share-access.interface';
import { RevokeAccess } from './interfaces/revoke-access.interface';
import { CopyFile } from './interfaces/copy-file.interface';
import { RenameFile } from './interfaces/rename-file.interface';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';

@Injectable()
export class FileFacadeImplementation implements FileFacade {
  constructor(
    private readonly fileService: FileService,
    @Inject(FILE_STORAGE_SERVICE_TOKEN)
    private readonly fileStorage: FileStorageService,
  ) {}

  public async uploadSingleFileWithException(
    data: UploadFile,
  ): Promise<string> {
    const key = await this.fileStorage.uploadSingleWithException(data);

    try {
      const created = await this.fileService.createSingle({
        key,
        ownerId: data.ownerId,
        ownerType: data.ownerType,
        sizeInBytes: Buffer.byteLength(data.buffer),
      });

      return key;
    } catch (err) {
      await this.fileStorage.deleteOne(key);

      throw new FileNotUploadedError();
    }
  }

  public async shareAccessWithException(data: ShareAccess): Promise<boolean> {
    const files = await this.fileService.findManyByIdsAndOwnerWithException(
      data.fileIds,
      data.ownerId,
      data.ownerType,
    );

    const attached = await this.fileService.attachTenantWithException({
      files,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
    });

    return attached;
  }

  public async revokeAccessWithException(data: RevokeAccess): Promise<boolean> {
    const files = await this.fileService.findManyByIdsAndOwnerWithException(
      data.fileIds,
      data.ownerId,
      data.ownerType,
    );

    const dettached = this.fileService.detachTenantWithException({
      files,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
    });

    return dettached;
  }

  public async copySingleWithException(data: CopyFile): Promise<string> {
    const source = await this.fileService.findSingleByIdAndOwnerWithException(
      data.fileId,
      data.ownerId,
      data.ownerType,
    );

    const key = await this.fileStorage.copySingleWithException(
      source.key,
      data.copyPath,
    );

    try {
      await this.fileService.createSingle({ ...source, key });

      return key;
    } catch (err) {
      await this.fileStorage.deleteOne(key);
    }
  }

  public async renameSingleWithException(data: RenameFile): Promise<string> {
    const source = await this.fileService.findSingleByIdAndOwnerWithException(
      data.fileId,
      data.ownerId,
      data.ownerType,
    );

    const key = await this.fileStorage.renameSingleWithException(
      source.key,
      data.name,
    );

    await this.fileService.updateKeyWithException(data.fileId, key);

    return key;
  }
}
