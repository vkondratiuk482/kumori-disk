import { DomainError } from 'src/common/domain-error';

export class AuthError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static AuthorizationHeadersNotProvided(): AuthError {
    return new AuthError('You have not provided authorization headers');
  }

  public static EmailAlreadyConfirmed(): AuthError {
    return new AuthError(`You've already confirmed your email address`);
  }

  public static EmailNotConfirmed(): AuthError {
    return new AuthError('You have to confirm your email address first');
  }

  public static GithubIdNotLinked(): AuthError {
    return new AuthError(
      'You have to link Github Account to your account in order to be able to sign in with Github',
    );
  }

  public static GithubIdsDoNotMatch(): AuthError {
    return new AuthError(
      'You are trying to sign in with the wrong Github account',
    );
  }

  public static InvalidAuthHeaders(): AuthError {
    return new AuthError('Authorization header has to be "Bearer ${token}"');
  }

  public static InvalidConfirmationHash(): AuthError {
    return new AuthError(
      `You've passed invalid confirmation hash, most likely it has expired or something else happened`,
    );
  }

  public static MailIsInUse(): AuthError {
    return new AuthError('Mail is already being used');
  }

  public static PasswordsNotMatching(): AuthError {
    return new AuthError('Passwords not matching');
  }
}
