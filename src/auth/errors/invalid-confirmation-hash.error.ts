export class InvalidConfirmationHashError extends Error {
  public readonly name: string = 'InvalidConfirmationHash';

  public readonly message: string = `You've passed invalid confirmation hash, most likely it has expired or something else happened`;
}
