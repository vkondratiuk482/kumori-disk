import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';

export interface ICreateUser {
  readonly email: string;

  readonly username: string;

  readonly password: string;

  readonly diskSpace: number;

  readonly confirmationStatus: UserConfirmationStatuses;
}
