import { Module } from '@nestjs/common';
import { JwtAccessOptions } from './factories/jwt-access.options';
import { JwtRefreshOptions } from './factories/jwt-refresh.options';
import { JwtServiceProvider } from './providers/jwt-service.provider';

@Module({
  providers: [JwtAccessOptions, JwtRefreshOptions, JwtServiceProvider],
  exports: [JwtServiceProvider],
})
export class JwtModule {}
