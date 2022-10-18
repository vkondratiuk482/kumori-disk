import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFile } from './interfaces/create-file.interface';
import { FileRepository } from './interfaces/file-repository.interface';

@Injectable()
export class FileRepositoryImplementation implements FileRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}

  public async findManyByIds(ids: string[]): Promise<File[]> {
    const files = await this.fileRepository
      .createQueryBuilder('f')
      .where('id IN (:...ids)', { ids })
      .getMany();

    return files;
  }

  public async createSingle(data: CreateFile): Promise<File> {
    let result: File;

    await this.dataSource.manager.transaction(async (manager) => {
      const fileRepository = manager.getRepository(File);

      const file = fileRepository.create(data);
      const user = await manager
        .getRepository(User)
        .createQueryBuilder('u')
        .where('id = :userId', { userId: data.userId })
        .getOne();

      file.users = [user];
      file.ownerId = user.id;

      result = await fileRepository.save(file);
    });

    return result;
  }

  public async saveMany(files: File[]): Promise<boolean> {
    const saved = Boolean(await this.fileRepository.save(files));

    return saved;
  }
}
