import { Module } from '@nestjs/common';
import { HttpServiceProvider } from './providers/http-service.provider';
import { UndiciHttpService } from './services/undici-http.service';

@Module({
  providers: [HttpServiceProvider, UndiciHttpService],
  exports: [HttpServiceProvider],
})
export class HttpModule {}
