import { Injectable } from '@nestjs/common';
import { CreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createSingle(data: CreateUser): Promise<User> {
    const user = await this.userRepository.createSingle(data);

    return user;
  }
}
