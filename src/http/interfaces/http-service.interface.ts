import { Request } from './request.interface';

export interface HttpService {
  request<T>(data: Request): Promise<T>;
}
