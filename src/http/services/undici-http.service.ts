import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { HttpClientRequestError } from '../errors/http-client-request.error';
import { UndiciRequest } from '../interfaces/undici-request.interface';

@Injectable()
export class UndiciHttpService {
  public async request<T>(payload: UndiciRequest): Promise<T> {
    try {
      const response = await request(payload.url, payload.options);

      const body = (await response.body.json()) as T;

      return body;
    } catch (err) {
      throw new HttpClientRequestError();
    }
  }
}
