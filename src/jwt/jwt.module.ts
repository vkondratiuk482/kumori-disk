import { Module } from '@nestjs/common';
import { JwtServiceProvider } from './providers/jwt-service.provider';

@Module({
  providers: [JwtServiceProvider],
  exports: [JwtServiceProvider],
})
export class JwtModule {}
