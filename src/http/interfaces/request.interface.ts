import { Headers } from './headers.interface';
import { HttpMethod } from '../enums/http-method.enum';
import { Body } from './body.interface';

export interface Request {
  readonly url: string;

  readonly headers: Headers;

  readonly method: HttpMethod;

  readonly body: Body;
}
