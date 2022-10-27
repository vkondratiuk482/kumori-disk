import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';

export abstract class UserEntity {
  readonly id: string;

  readonly email: string;

  readonly username: string;

  readonly password: string;

  readonly confirmationStatus: UserConfirmationStatus;

  readonly availableStorageSpaceInBytes: number;
}
