import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUser } from './interfaces/create-user.interface';
import { UserRepositoryInterface } from './interfaces/user-repository.interface';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

@Injectable()
export class UserRepository implements UserRepositoryInterface<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findSingleByUuid(uuid: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('uuid = :uuid', { uuid })
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

    const user = this.userRepository.create({ ...data, confirmationStatus });

    return this.userRepository.save(user);
  }
}
