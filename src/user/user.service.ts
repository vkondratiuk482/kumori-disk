import { Injectable } from '@nestjs/common';
import { CreateUser } from './interfaces/create-user.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findSingleByUuid(uuid: string): Promise<User> {
    const user = await this.userRepository.findSingleByUuid(uuid);

    return user;
  }

  public async findSingleByUuidWithException(uuid: string): Promise<User> {
    const user = await this.userRepository.findSingleByUuidWithException(uuid);

    return user;
  }

  public async findSingleByUsernameWithException(
    username: string,
  ): Promise<User> {
    const user = await this.userRepository.findSingleByUsernameWithException(
      username,
    );

    return user;
  }

  public async createSingle(data: CreateUser): Promise<User> {
    const user = await this.userRepository.createSingle(data);

    return user;
  }
}
