import { ICreateUser } from './create-user.interface';
import { IUserEntity } from './user-entity.interface';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

export interface IUserRepository {
  findById(id: string): Promise<IUserEntity>;

  findByEmail(email: string): Promise<IUserEntity>;

  findByUsername(username: string): Promise<IUserEntity>;

  existsById(id: string): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;

  create(data: ICreateUser): Promise<IUserEntity>;

  updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatuses,
  ): Promise<boolean>;

  updateGithubId(id: string, githubId: number): Promise<boolean>;

  subtractAvailableSpaceInBytes(id: string, bytes: number): Promise<boolean>;
}
