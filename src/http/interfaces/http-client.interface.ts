import { IHttpRequest } from './http-request.interface';

export interface IHttpClient {
  request<T>(data: IHttpRequest): Promise<T>;
}
