import { Inject, Injectable } from '@nestjs/common';
import { UploadFile } from './interfaces/upload-file.interface';
import { FileFacade } from './interfaces/file-facade.interface';
import { FileStorageService } from './interfaces/file-storage-service.interface';
import { FILE_STORAGE_SERVICE_TOKEN } from './constants/file.constants';
import { FileService } from './services/file.service';
import { ShareAccess } from 'src/file/interfaces/share-access.interface';
import { RevokeAccess } from './interfaces/revoke-access.interface';

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

	public async copySingleWithException(uuid: string, copyPath: string): Promise<boolean> {
		const file = await this.fileService.
	}
}
