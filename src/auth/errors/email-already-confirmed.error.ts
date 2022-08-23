export class EmailAlreadyConfirmedError extends Error {
  public readonly name: string = 'EmailAlreadyConfirmed';

  public readonly message: string = `You've already confirmed your email address`;
}
