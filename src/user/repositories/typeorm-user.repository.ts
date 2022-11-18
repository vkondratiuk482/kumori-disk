import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { TypeOrmUserEntityImplementation } from '../entities/typeorm-user.entity';

import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { CreateUser } from '../interfaces/create-user.interface';
import { UserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class TypeOrmUserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntityImplementation)
    private readonly userRepository: Repository<TypeOrmUserEntityImplementation>,
  ) {}

  public async findSingleById(
    id: string,
  ): Promise<TypeOrmUserEntityImplementation> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('id = :id', { id })
      .getOne();

    return user;
  }

  public async findSingleByUsername(
    username: string,
  ): Promise<TypeOrmUserEntityImplementation> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('username = :username', { username })
      .getOne();

    return user;
  }

  public async findSingleByEmail(
    email: string,
  ): Promise<TypeOrmUserEntityImplementation> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  public async createSinglePending(
    data: CreateUser,
  ): Promise<TypeOrmUserEntityImplementation> {
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
