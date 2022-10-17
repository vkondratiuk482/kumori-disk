import { CreateUser } from './create-user.interface';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { User } from '../entities/user.entity';

export interface UserRepository {
  findSingleById(id: string): Promise<User>;

  findSingleByUsername(username: string): Promise<User>;

  findSingleByEmail(email: string): Promise<User>;

  createSinglePending(data: CreateUser): Promise<User>;

  updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean>;
}
