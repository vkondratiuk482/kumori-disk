export class PaypalAccessTokenNotFoundInCacheError extends Error {
  public readonly name: string = 'PaypalAccessTokenNotFoundInCache';

  public readonly message: string =
    'Paypal access token has not found in cache';
}
