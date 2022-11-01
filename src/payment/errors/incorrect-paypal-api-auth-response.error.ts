export class IncorrectPaypalApiAuthResponseError extends Error {
  public readonly name: string = 'IncorrectPaypalApiAuthResponse';

  public readonly message: string =
    'Received incorrect Paypal API auth response';
}
