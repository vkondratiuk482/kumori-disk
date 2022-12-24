import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { RequestExecutionError } from '../errors/request-execution.error';
import { UndiciRequest } from '../interfaces/undici-request.interface';

@Injectable()
export class UndiciHttpService {
  public async request<T>(data: UndiciRequest): Promise<T> {
    try {
      const response = await request(data.url, data.options);

      const responseData = (await response.body.json()) as T;

      return responseData;
    } catch (err) {
      throw new RequestExecutionError();
    }
  }
}
