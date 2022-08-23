import { CreateUser } from './create-user.interface';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';

export interface UserRepositoryInterface<User> {
  findSingleByUuid(uuid: string): Promise<User>;

  findSingleByUsername(username: string): Promise<User>;

  findSingleByEmail(email: string): Promise<User>;

  createSinglePending(data: CreateUser): Promise<User>;

  updateConfirmationStatus(
    uuid: string,
    status: UserConfirmationStatus,
  ): Promise<boolean>;
}
