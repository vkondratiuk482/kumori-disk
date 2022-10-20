import { Inject, Injectable } from '@nestjs/common';
import { File } from './entities/file.entity';
import { UploadFile } from './interfaces/upload-file.interface';
import { FileFacade } from './interfaces/file-facade.interface';
import { FileStorageService } from './interfaces/file-storage-service.interface';
import { FILE_STORAGE_SERVICE_TOKEN } from './constants/file.constants';
import { FileService } from './services/file.service';

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
        sizeInBytes: Buffer.byteLength(data.buffer),
      });

      return key;
    } catch (err) {
      await this.fileStorage.deleteOne(key);
    }
  }

  public async findManyByIdsAndOwnerIdInDatabaseWithException(
    ids: string[],
    ownerId: string,
  ): Promise<File[]> {
    const files = await this.fileService.findManyByIdsAndOwnerIdWithException(
      ids,
      ownerId,
    );

    return files;
  }

  public async saveManyInDatabase(files: File[]): Promise<boolean> {
    const saved = await this.fileService.saveMany(files);

    return saved;
  }
}
