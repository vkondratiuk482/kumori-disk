export class UserNotFoundByIdError extends Error {
  public readonly name: string = 'UserNotFoundById';

  public readonly message: string = 'There is no user under this id';
}
