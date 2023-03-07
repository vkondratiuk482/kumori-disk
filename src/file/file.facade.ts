import { Inject, Injectable } from '@nestjs/common';
import { IUploadFile } from './interfaces/upload-file.interface';
import { IFileFacade } from './interfaces/file-facade.interface';
import { IFileStorageService } from './interfaces/file-storage-service.interface';
import { FileService } from './services/file.service';
import { IShareAccess } from 'src/file/interfaces/share-access.interface';
import { IRevokeAccess } from './interfaces/revoke-access.interface';
import { ICopyFile } from './interfaces/copy-file.interface';
import { IRenameFile } from './interfaces/rename-file.interface';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { FILE_CONSTANTS } from './file.constants';

@Injectable()
export class FileFacadeImplementation implements IFileFacade {
  constructor(
    private readonly fileService: FileService,
    @Inject(FILE_CONSTANTS.APPLICATION.STORAGE_SERVICE_TOKEN)
    private readonly fileStorage: IFileStorageService,
  ) {}

  public async uploadSingleFileWithException(
    data: IUploadFile,
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

  public async shareAccessWithException(data: IShareAccess): Promise<boolean> {
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

  public async revokeAccessWithException(data: IRevokeAccess): Promise<boolean> {
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

  public async copySingleWithException(data: ICopyFile): Promise<string> {
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

  public async renameSingleWithException(data: IRenameFile): Promise<string> {
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
