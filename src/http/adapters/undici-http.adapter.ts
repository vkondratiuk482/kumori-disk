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
    const body = payload.body && this.adaptBody(payload.body);
    const query: Record<string, any> = payload.query || undefined;
    const headers: IncomingHttpHeaders = payload.headers || undefined;

    const response = await this.undiciHttpService.request<T>({
      url: payload.url,
      options: {
        body,
        query,
        headers,
        method: payload.method,
      },
    });

    return response;
  }

  /**
   * Replace it with HttpBodyFactory in case there are more body types
   */
  private adaptBody(body: HttpBody): string {
    if (typeof body === 'string') {
      return body;
    } else if (typeof body === 'object') {
      return JSON.stringify(body);
    }
  }
}
