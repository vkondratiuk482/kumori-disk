export class IHttpClientRequestError extends Error {
  public readonly name: string = 'IHttpClientRequest';

  public readonly message: string =
    'An error occurred while executing IHttpClient request';
}
