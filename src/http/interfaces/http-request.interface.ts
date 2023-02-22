import { HttpBody } from './http-body.interface';
import { HttpMethod } from '../enums/http-method.enum';

export interface HttpRequest {
  readonly url: string;

  readonly method: HttpMethod;

  readonly body?: HttpBody;

  readonly headers?: Record<string, any>;
}
