import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

export interface CreateUser {
  readonly email: string;

  readonly username: string;

  readonly password: string;

  readonly diskSpace: number;

  readonly confirmationStatus: UserConfirmationStatuses;
}
