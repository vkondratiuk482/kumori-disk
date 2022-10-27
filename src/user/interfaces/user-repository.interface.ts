import { CreateUser } from './create-user.interface';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { UserEntity } from './user-entity.interface';

export interface UserRepository {
  findSingleById(id: string): Promise<UserEntity>;

  findSingleByUsername(username: string): Promise<UserEntity>;

  findSingleByEmail(email: string): Promise<UserEntity>;

  createSinglePending(data: CreateUser): Promise<UserEntity>;

  updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean>;
}
