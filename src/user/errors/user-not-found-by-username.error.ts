export class UserNotFoundByUsernameError extends Error {
  public readonly name: string = 'UserNotFoundByUsername';

  public readonly message: string = 'There is no user under this username';
}
