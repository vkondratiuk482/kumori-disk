export class UserNotFoundByEmailError extends Error {
  public readonly name: string = 'UserNotFoundByEmail';

  public readonly message: string = 'There is no user under this email';
}
