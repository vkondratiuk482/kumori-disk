import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY_TOKEN } from './constants/user.constants';
import { User } from './entities/user.entity';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

import { UserNotFoundByEmailError } from './errors/user-not-found-by-email.error';
import { UserNotFoundByUsernameError } from './errors/user-not-found-by-username.error';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';

import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  public async findSingleById(id: string): Promise<User> {
    const user = await this.userRepository.findSingleById(id);

    return user;
  }

  public async findSingleByIdWithException(id: string): Promise<User> {
    const user = await this.userRepository.findSingleById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user;
  }

  public async findSingleByUsernameWithException(
    username: string,
  ): Promise<User> {
    const user = await this.userRepository.findSingleByUsername(username);

    if (!user) {
      throw new UserNotFoundByUsernameError();
    }

    return user;
  }

  public async findSingleByEmailWithException(email: string): Promise<User> {
    const user = await this.userRepository.findSingleByEmail(email);

    if (!user) {
      throw new UserNotFoundByEmailError();
    }

    return user;
  }

  public async getAvailableStorageSpaceByIdWithException(
    id: string,
  ): Promise<number> {
    const user = await this.userRepository.findSingleById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user.availableStorageSpaceInBytes;
  }

  public async mailUsed(email: string): Promise<boolean> {
    const user = await this.userRepository.findSingleByEmail(email);

    const mailUsed = Boolean(user);

    return mailUsed;
  }

  public async createSingleForSignUp(data: CreateUser): Promise<User> {
    const user = await this.userRepository.createSinglePending(data);

    return user;
  }

  public async updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean> {
    const updated = await this.userRepository.updateConfirmationStatus(
      id,
      status,
    );

    return updated;
  }
}
