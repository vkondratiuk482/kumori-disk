import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TypeOrmUserEntityImplementation } from '../entities/typeorm-user.entity';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

import { CreateUser } from '../interfaces/create-user.interface';
import { UserEntity } from '../interfaces/user-entity.interface';
import { UserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class TypeOrmUserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntityImplementation)
    private readonly userRepository: Repository<TypeOrmUserEntityImplementation>,
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
    const user = await this.userRepository
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

  public async create(data: CreateUser): Promise<UserEntity> {
    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
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

      user.availableStorageSpaceInBytes -= bytes;

      await this.userRepository.save(user);

      return true;
    } catch (err) {
      return false;
    }
  }
}
