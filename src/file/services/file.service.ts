import { Inject, Injectable } from '@nestjs/common';
import { FileNotAccessibleError } from '../errors/file-not-accessible.error';
import { FILE_REPOSITORY_TOKEN } from '../constants/file.constants';
import { FileRepository } from '../interfaces/file-repository.interface';
import { CreateFile } from '../interfaces/create-file.interface';
import { File } from '../entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY_TOKEN)
    private readonly fileRepository: FileRepository,
  ) {}

  public async findManyByIdsAndOwnerIdWithException(
    ids: string[],
    ownerId: string,
  ): Promise<File[]> {
    const files = await this.fileRepository.findManyByIds(ids);

    for (const file of files) {
      if (file.ownerId !== ownerId) {
        throw new FileNotAccessibleError();
      }
    }

    return files;
  }

  public async createSingle(data: CreateFile): Promise<File> {
    const file = await this.fileRepository.createSingle(data);

    return file;
  }

  public async saveMany(files: File[]): Promise<boolean> {
    const saved = await this.fileRepository.saveMany(files);

    return saved;
  }
}
