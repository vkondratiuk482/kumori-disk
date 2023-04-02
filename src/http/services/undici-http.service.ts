import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { HttpError } from '../errors/http.error';
import { IUndiciRequest } from '../interfaces/undici-request.interface';

@Injectable()
export class UndiciHttpService {
  public async request<T>(payload: IUndiciRequest): Promise<T> {
    try {
      const response = await request(payload.url, payload.options);

      const body = (await response.body.json()) as T;

      return body;
    } catch (err) {
      throw HttpError.ClientRequestFailed();
    }
  }
}
