export class UserNotFoundByUuidError extends Error {
  public readonly name: string = 'UserNotFoundByUuid';

  public readonly message: string = 'There is no user under this uuid';
}
