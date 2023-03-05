import { Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';

import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { TypeOrmUserEntityImplementation } from '../entities/typeorm-user.entity';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

import { CreateUser } from '../interfaces/create-user.interface';
import { UserEntity } from '../interfaces/user-entity.interface';
import { UserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class TypeOrmUserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(TypeOrmUserEntityImplementation)
    private readonly userRepository: Repository<TypeOrmUserEntityImplementation>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly als: AsyncLocalStorage<QueryRunner>,
  ) {}

  public async findById(id: string): Promise<TypeOrmUserEntityImplementation> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('id = :id', { id })
      .getOne();

    return user;
  }

  public async findByUsername(
    username: string,
  ): Promise<TypeOrmUserEntityImplementation> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('username = :username', { username })
      .getOne();

    return user;
  }

  public async findByEmail(
    email: string,
  ): Promise<TypeOrmUserEntityImplementation> {
    const queryRunner = this.als.getStore();

    const userRepository =
      queryRunner?.manager?.getRepository(TypeOrmUserEntityImplementation) ||
      this.userRepository;

    const user = await userRepository
      .createQueryBuilder('u')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  public async existsById(id: string): Promise<boolean> {
    const exists = await this.userRepository.exist({
      where: {
        id,
      },
    });

    return exists;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.exist({
      where: {
        email,
      },
    });

    return exists;
  }

  public async create(data: CreateUser): Promise<UserEntity> {
    const manager = this.als.getStore()?.manager || this.manager;

    const user = manager
      .getRepository(TypeOrmUserEntityImplementation)
      .create(data);

    return manager.save(user);
  }

  public async updateGithubId(id: string, githubId: number): Promise<boolean> {
    const result = await this.userRepository
      .createQueryBuilder('u')
      .update(TypeOrmUserEntityImplementation)
      .set({
        githubId,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    const updated = result.affected && result.affected > 0;

    return updated;
  }

  public async updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatuses,
  ): Promise<boolean> {
    const result = await this.userRepository
      .createQueryBuilder('u')
      .update(TypeOrmUserEntityImplementation)
      .set({
        confirmationStatus: status,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    const updated = result.affected && result.affected > 0;

    return updated;
  }

  public async subtractAvailableSpaceInBytes(
    id: string,
    bytes: number,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('u')
        .where('id = :id', { id })
        .getOne();

      user.diskSpace -= bytes;

      await this.userRepository.save(user);

      return true;
    } catch (err) {
      return false;
    }
  }
}
