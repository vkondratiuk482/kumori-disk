import { CreateUser } from './create-user.interface';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { UserEntity } from './user-entity.interface';

export interface UserRepository {
  findById(id: string): Promise<UserEntity>;

  findSingleByUsername(username: string): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity>;

  create(data: CreateUser): Promise<UserEntity>;

  updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean>;

  subtractAvailableSpaceInBytes(id: string, bytes: number): Promise<boolean>;
}
