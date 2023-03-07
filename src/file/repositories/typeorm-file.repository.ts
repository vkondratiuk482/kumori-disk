import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from 'src/user/entities/typeorm-user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TypeOrmFileEntity } from '../entities/typeorm-file.entity';
import { FileConsumer } from '../enums/file-consumer.enum';
import { FileTenantKey } from '../enums/file-tenant-key.enum';
import { IAttachTenant } from '../interfaces/attach-tenant.interface';
import { ICreateFile } from '../interfaces/create-file.interface';
import { IDettachTenant } from '../interfaces/dettach-tenant.interface';
import { IFileConsumerRepositoryAndTenantKey } from '../interfaces/file-consumer-repository-and-tenant-key.interface';
import { IFileRepository } from '../interfaces/file-repository.interface';

@Injectable()
export class TypeOrmFileRepository implements IFileRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(TypeOrmFileEntity)
    private readonly fileRepository: Repository<TypeOrmFileEntity>,
  ) {}

  public async findSingleById(
    id: string,
  ): Promise<TypeOrmFileEntity> {
    const file = await this.fileRepository
      .createQueryBuilder('f')
      .where('id = :id', { id })
      .getOne();

    return file;
  }

  public async findManyByIdsWithOwners(
    ids: string[],
    ownerType: FileConsumer,
  ): Promise<TypeOrmFileEntity[]> {
    const { tenantKey } =
      this.getRepositoryAndTenantKeyByFileConsumer(ownerType);

    const files = await this.fileRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect(`f.${tenantKey}`, 'o')
      .where('f.id IN (:...ids)', { ids })
      .getMany();

    return files;
  }

  public async createSingle(
    data: ICreateFile,
  ): Promise<TypeOrmFileEntity> {
    let result: TypeOrmFileEntity;

    await this.dataSource.manager.transaction(
      async (manager: EntityManager): Promise<void> => {
        const fileRepository = manager.getRepository(
          TypeOrmFileEntity,
        );
        const file = fileRepository.create(data);

        const { repository: ownerRepository, tenantKey } =
          this.getRepositoryAndTenantKeyByFileConsumer(data.ownerType, manager);

        const owner = await ownerRepository
          .createQueryBuilder('o')
          .where('id = :ownerId', { ownerId: data.ownerId })
          .getOne();

        file.ownerId = data.ownerId;
        file.ownerType = data.ownerType;
        file[tenantKey] = [owner];

        result = await fileRepository.save(file);
      },
    );

    return result;
  }

  public async updateKey(id: string, key: string): Promise<boolean> {
    const result = await this.fileRepository
      .createQueryBuilder('u')
      .update(TypeOrmFileEntity)
      .set({
        key,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    const updated = result.affected && result.affected > 0;

    return updated;
  }

  public async attachTenant(data: IAttachTenant): Promise<boolean> {
    try {
      const { repository: tenantRepository, tenantKey } =
        this.getRepositoryAndTenantKeyByFileConsumer(data.tenantType);

      const tenant = await tenantRepository
        .createQueryBuilder('t')
        .where('id = :tenantId', { tenantId: data.tenantId })
        .getOne();

      for (const file of data.files) {
        file[tenantKey].push(tenant);
      }

      await this.fileRepository.save(data.files);

      return true;
    } catch (err) {
      return false;
    }
  }

  public async dettachTenant(data: IDettachTenant): Promise<boolean> {
    try {
      const { repository: tenantRepository, tenantKey } =
        this.getRepositoryAndTenantKeyByFileConsumer(data.tenantType);

      const tenant = await tenantRepository
        .createQueryBuilder('t')
        .where('id = :tenantId', { tenantId: data.tenantId })
        .getOne();

      for (const file of data.files) {
        const tenants = [];

        for (const tenant of file[tenantKey]) {
          if (tenant.id === data.tenantId) {
            continue;
          }

          tenants.push(tenant);
        }

        file[tenantKey] = tenants;
      }

      await this.fileRepository.save(data.files);

      return true;
    } catch (err) {
      return false;
    }
  }

  private getRepositoryAndTenantKeyByFileConsumer(
    consumer: FileConsumer,
    manager?: EntityManager,
  ): IFileConsumerRepositoryAndTenantKey {
    if (!manager) {
      manager = this.dataSource.manager;
    }

    switch (consumer) {
      case FileConsumer.User: {
        const tenantKey = FileTenantKey.User;
        const repository = manager.getRepository(
          TypeOrmUserEntity,
        );

        return { repository, tenantKey };
      }
    }
  }
}
