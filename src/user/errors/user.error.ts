import { DomainError } from 'src/common/domain-error';

export class UserError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static NotFound(): UserError {
    return new UserError('There is no user under specified search criteria');
  }

  public static ExceedsDiskSpace(): UserError {
    return new UserError('You are trying to exceed available disk space');
  }
}
