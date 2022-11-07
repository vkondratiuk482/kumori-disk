import { Module } from '@nestjs/common';
import { HttpServiceProvider } from './providers/http-service.provider';

@Module({
  providers: [HttpServiceProvider],
  exports: [HttpServiceProvider],
})
export class HttpModule {}
