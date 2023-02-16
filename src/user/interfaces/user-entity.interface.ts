import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

export interface UserEntity {
  readonly id: string;

  readonly email: string;

  readonly username: string;

  readonly password: string;

  readonly availableStorageSpaceInBytes: number;

  readonly confirmationStatus: UserConfirmationStatuses;
}
