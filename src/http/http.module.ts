import { Module } from '@nestjs/common';
import { UndiciHttpService } from './services/undici-http.service';
import { HttpClientProvider } from './providers/http-client.provider';
import { HttpTransformerServiceProvider } from './providers/http-transformer-service.provider';

@Module({
  providers: [
    HttpClientProvider,
    UndiciHttpService,
    HttpTransformerServiceProvider,
  ],
  exports: [HttpClientProvider, HttpTransformerServiceProvider],
})
export class HttpModule {}
