import { DomainError } from 'src/common/domain-error';

export class HttpError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static ClientRequestFailed(): HttpError {
    return new HttpError('An error occurred during HttpClient request');
  }
}
