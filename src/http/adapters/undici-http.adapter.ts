import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'node:http';
import { UndiciHttpService } from '../services/undici-http.service';
import { HttpClient } from '../interfaces/http-client.interface';
import { HttpRequest } from '../interfaces/http-request.interface';
import { HttpBody } from '../interfaces/http-body.interface';

@Injectable()
export class UndiciHttpAdapter implements HttpClient {
  constructor(private readonly undiciHttpService: UndiciHttpService) {}

  public async request<T>(payload: HttpRequest): Promise<T> {
    /**
     * Check if body is string
     */
    const body: HttpBody = payload.body && JSON.stringify(payload.body);
    const headers: IncomingHttpHeaders = payload.headers || undefined;

    const response = await this.undiciHttpService.request<T>({
      url: payload.url,
      options: {
        body,
        headers,
        method: payload.method,
      },
    });

    return response;
  }
}
