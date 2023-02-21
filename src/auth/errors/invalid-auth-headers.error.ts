export class InvalidAuthHeadersError extends Error {
  public readonly name: string = 'InvalidAuthHeaders';

  public readonly message: string =
    'Authorization header has to be "Bearer ${token}"';
}
