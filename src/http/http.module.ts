import { Module } from '@nestjs/common';
import { UndiciHttpService } from './services/undici-http.service';
import { HttpClientProvider } from './providers/http-client.provider';

@Module({
  providers: [HttpClientProvider, UndiciHttpService],
  exports: [HttpClientProvider],
})
export class HttpModule {}
