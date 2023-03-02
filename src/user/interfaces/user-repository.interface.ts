import { CreateUser } from './create-user.interface';
import { UserEntity } from './user-entity.interface';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

export interface UserRepository {
  findById(id: string): Promise<UserEntity>;

  findByUsername(username: string): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity>;

  existsById(id: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;

  create(data: CreateUser): Promise<UserEntity>;

  updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatuses,
  ): Promise<boolean>;

  updateGithubId(id: string, githubId: number): Promise<boolean>;

  subtractAvailableSpaceInBytes(id: string, bytes: number): Promise<boolean>;
}
