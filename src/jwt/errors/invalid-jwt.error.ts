export class InvalidJwtError extends Error {
  public readonly name: string = 'InvalidJwt';

  public readonly message: string = 'You have provided invalid JSON web token';
}
