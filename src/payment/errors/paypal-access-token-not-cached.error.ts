export class PaypalAccessTokenNotCachedError extends Error {
  public readonly name: string = 'PaypalAccessTokenNotCached';

  public readonly message: string = 'Paypal access token has not been cached';
}
