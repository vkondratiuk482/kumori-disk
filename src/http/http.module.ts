import { Module } from '@nestjs/common';
import { HttpClientProvider } from './providers/http-client.provider';
import { UndiciHttpService } from './services/undici-http.service';

@Module({
  providers: [HttpClientProvider, UndiciHttpService],
  exports: [HttpClientProvider],
})
export class HttpModule {}
