import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';
import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepositoryImplementation implements UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findSingleById(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('id = :id', { id })
      .getOne();

    return user;
  }

  public async findSingleByUsername(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('username = :username', { username })
      .getOne();

    return user;
  }

  public async findSingleByEmail(email: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('email = :email', { email })
      .getOne();

    return user;
  }

  public async createSinglePending(data: CreateUser): Promise<User> {
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
      .update(User)
      .set({
        confirmationStatus: status,
      })
      .where('id = :id', { id })
      .returning('*')
      .execute();

    const updated = result.affected && result.affected > 0;

    return updated;
  }
}
