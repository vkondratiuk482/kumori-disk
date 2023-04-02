import { DomainError } from 'src/common/domain-error';

export class JwtError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static InvalidJwt(): JwtError {
    return new JwtError('You have provided invalid JSON web token');
  }
}
