import { Injectable } from '@nestjs/common';
import { HttpTransformerService } from '../interfaces/http-transformer-service.interface';

@Injectable()
export class NativeHttpTransformerServiceImpl
  implements HttpTransformerService
{
  query(params: Record<string, string>): string {
    const entries: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      const entry = `${key}=${value}`;

      entries.push(entry);
    }

    return entries.join('&');
  }
}
