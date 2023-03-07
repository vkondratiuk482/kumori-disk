import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'node:http';
import { UndiciHttpService } from '../services/undici-http.service';
import { IHttpClient } from '../interfaces/http-client.interface';
import { IHttpRequest } from '../interfaces/http-request.interface';
import { IHttpBody } from '../interfaces/http-body.interface';
import { IUndiciRequest } from '../interfaces/undici-request.interface';

@Injectable()
export class UndiciHttpAdapter implements IHttpClient {
  constructor(private readonly undiciHttpService: UndiciHttpService) {}

  public async request<T>(payload: IHttpRequest): Promise<T> {
    const request: IUndiciRequest = {
      url: payload.url,
      options: {
        method: payload.method,
        headers: payload.headers || {},
      },
    };

    if (payload.body) {
      const body = this.adaptBody(payload.body);

      request.options.body = body;
    }

    if (payload.query) {
      const query = payload.query;

      request.options.query = query;
    }

    const response = await this.undiciHttpService.request<T>(request);

    return response;
  }

  /**
   * Replace it with HttpBodyFactory in case there are more body types
   */
  private adaptBody(body: IHttpBody): string {
    if (typeof body === 'string') {
      return body;
    } else if (typeof body === 'object') {
      return JSON.stringify(body);
    }
  }
}
