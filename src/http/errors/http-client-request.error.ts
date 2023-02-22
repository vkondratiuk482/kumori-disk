export class HttpClientRequestError extends Error {
  public readonly name: string = 'HttpClientRequest';

  public readonly message: string =
    'An error occurred while executing HttpClient request';
}
