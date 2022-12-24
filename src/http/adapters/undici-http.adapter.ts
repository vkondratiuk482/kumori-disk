import { Injectable } from '@nestjs/common';
import { serialize } from 'node:v8';
import { IncomingHttpHeaders } from 'node:http';
import { Body } from '../interfaces/body.interface';
import { Request } from '../interfaces/request.interface';
import { HttpService } from '../interfaces/http-service.interface';
import { UndiciRequest } from '../interfaces/undici-request.interface';
import { UndiciHttpService } from '../services/undici-http.service';

@Injectable()
export class UndiciHttpAdapter implements HttpService {
  constructor(private readonly undiciHttpService: UndiciHttpService) {}

  public async request<T>(data: Request): Promise<T> {
    const convertedRequest: UndiciRequest = this.convertRequest(data);

    const response = await this.undiciHttpService.request<T>(convertedRequest);

    return response;
  }

  private convertRequest(data: Request): UndiciRequest {
    let body: Buffer;
    let headers: IncomingHttpHeaders;

    if (data.body) {
      body = this.convertBodyToBuffer(data.body);
    }

    if (data.headers) {
      headers = data.headers;
    }

    const converted: UndiciRequest = {
      url: data.url,
      options: {
        body,
        headers,
        method: data.method,
      },
    };

    return converted;
  }

  private convertBodyToBuffer(body: Body): Buffer {
    if (typeof body === 'object') {
      return serialize(body);
    }

    return Buffer.from(body);
  }
}
