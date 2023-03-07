import { Module } from '@nestjs/common';
import { UndiciHttpService } from './services/undici-http.service';
import { IHttpClientProvider } from './providers/http-client.provider';

@Module({
  providers: [IHttpClientProvider, UndiciHttpService],
  exports: [IHttpClientProvider],
})
export class HttpModule {}
