import { Injectable } from '@nestjs/common';
import { request } from 'undici';
import { Body } from './interfaces/body.interface';
import { HttpService } from './interfaces/http-service.interface';
import { Request } from './interfaces/request.interface';
import { serialize } from 'node:v8';

@Injectable()
export class UndiciHttpServiceImplementation implements HttpService {
  // Mock implementation
  public async request<T>(data: Request): Promise<T> {
    const body = this.convertBodyToBuffer(data.body);

    const response = await request(data.url, {
      body,
      method: data.method,
      headers: data.headers,
    });

    const responseData = (await response.body.json()) as T;

    return responseData;
  }

  private convertBodyToBuffer(body: Body): Buffer {
    if (body instanceof Buffer) {
      return body;
    } else if (typeof body === 'object') {
      return serialize(body);
    }

    return Buffer.from(body);
  }
}
