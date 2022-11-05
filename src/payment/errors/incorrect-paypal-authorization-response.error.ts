export class IncorrectPaypalAuthorizationResponseError extends Error {
  public readonly name: string = 'IncorrectPaypalAuthorizationResponse';

  public readonly message: string =
    'Received incorrect Paypal authorization response';
}
