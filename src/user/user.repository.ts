import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TypeOrmUserEntity } from './entities/user.entity';

import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';
import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly userRepository: Repository<TypeOrmUserEntity>,
  ) {}

  public async findSingleById(id: string): Promise<TypeOrmUserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('id = :id', { id })
      .getOne();

    return user;
  }

  public async findSingleByUsername(
    username: string,
  ): Promise<TypeOrmUserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('username = :username', { username })
      .getOne();

    return user;
  }

  public async findSingleByEmail(email: string): Promise<TypeOrmUserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  public async createSinglePending(
    data: CreateUser,
  ): Promise<TypeOrmUserEntity> {
    const confirmationStatus = UserConfirmationStatus.Pending;

    const user = this.userRepository.create({
      ...data,
      confirmationStatus,
    });

    return this.userRepository.save(user);
  }

  public async updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean> {
    const result = await this.userRepository
      .createQueryBuilder('u')
      .update(TypeOrmUserEntity)
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
