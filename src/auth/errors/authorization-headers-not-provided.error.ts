export class AuthorizationHeadersNotProvidedError extends Error {
  public readonly name: string = 'AuthorizationHeadersNotProvided';

  public readonly message: string =
    'You have not provided authorization headers';
}
