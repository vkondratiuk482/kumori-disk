import { HttpRequest } from './http-request.interface';

export interface HttpClient {
  request<T>(data: HttpRequest): Promise<T>;
}
