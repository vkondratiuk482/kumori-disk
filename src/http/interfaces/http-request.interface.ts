import { IHttpBody } from './http-body.interface';
import { HttpMethod } from '../enums/http-method.enum';

export interface IHttpRequest {
  readonly url: string;

  readonly body?: IHttpBody;

  readonly method: HttpMethod;

  readonly query?: Record<string, any>;

  readonly headers?: Record<string, any>;
}
