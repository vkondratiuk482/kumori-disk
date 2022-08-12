import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUser } from './interfaces/create-user.interface';

@Injectable()
export class UserRepository {
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

  public async findSingleByUuidWithException(uuid: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('uuid = :uuid', { uuid })
      .getOne();

    if (!user) {
      throw new Error('There is no user under this uuid');
    }

    return user;
  }

  public async createSingle(value: CreateUser): Promise<User> {
    const user = this.userRepository.create(value);

    return this.userRepository.save(user);
  }

  public async createBulk(): Promise<User[]> {}

  public async updateSingle(): Promise<User> {}

  public async updateBulk(): Promise<User[]> {}

  public async removeSingle(): Promise<boolean> {}

  public async removeBulk(): Promise<boolean> {}
}
