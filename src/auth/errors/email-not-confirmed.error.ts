export class EmailNotConfirmedError extends Error {
  public readonly name: string = 'EmailNotConfirmed';

  public readonly message: string =
    'You have to confirm your email address first';
}
