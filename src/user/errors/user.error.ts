import { DomainError } from 'src/common/domain-error';

export class UserError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  static NotFound(): UserError {
    return new UserError('There is no user under specified search criteria');
  }
}
