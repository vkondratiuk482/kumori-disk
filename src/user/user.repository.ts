import { Injectable } from '@nestjs/common';

import { DynamoStore } from '@shiftcoders/dynamo-easy';
import crypto from 'crypto';

import { User } from './user.entity';

import { CreateUser } from './interfaces/create-user.interface';
import { UserRepositoryInterface } from './interfaces/user-repository.interface';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

@Injectable()
export class UserRepository implements UserRepositoryInterface<User> {
  /**
   * Create a separate Nest provider and then inject it
   */
  private readonly store: DynamoStore<User> = new DynamoStore<User>(User);

  public async findSingleByUuid(uuid: string): Promise<User> {
    const user = await this.store.get(uuid).exec();

    return user;
  }

  public async findSingleByUsername(username: string): Promise<User> {
    const user = await this.store
      .query()
      .whereAttribute('username')
      .equals(username)
      .execSingle();

    return user;
  }

  public async findSingleByEmail(email: string): Promise<User> {
    const user = await this.store
      .query()
      .whereAttribute('email')
      .equals(email)
      .execSingle();

    return user;
  }

  public async createSinglePending(data: CreateUser): Promise<User> {
    const uuid = crypto.randomUUID();
    const confirmationStatus = UserConfirmationStatus.Pending;

    const userSchema = new User();

    userSchema.uuid = uuid;
    userSchema.email = data.email;
    userSchema.username = data.username;
    userSchema.password = data.password;
    userSchema.confirmationStatus = confirmationStatus;

    const user = await this.store
      .put(userSchema)
      .returnValues('ALL_OLD')
      .exec();

    return user;
  }

  public async updateConfirmationStatus(
    uuid: string,
    status: UserConfirmationStatus,
  ): Promise<boolean> {
    const result = await this.store
      .update(uuid)
      .updateAttribute('confirmationStatus')
      .set(status)
      .returnValues('ALL_OLD')
      .exec();

    const isUpdated = result.confirmationStatus === status;

    return isUpdated;
  }
}
