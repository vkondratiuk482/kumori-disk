import { HttpBody } from './http-body.interface';
import { HttpMethod } from '../enums/http-method.enum';

export interface HttpRequest {
  readonly url: string;

  readonly body?: HttpBody;

  readonly method: HttpMethod;

  readonly query?: Record<string, any>;

  readonly headers?: Record<string, any>;
}
