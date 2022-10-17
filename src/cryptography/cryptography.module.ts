import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptographyServiceProvider } from './providers/cryptography-service.provider';

@Module({
  imports: [ConfigModule],
  providers: [CryptographyServiceProvider],
  exports: [CryptographyServiceProvider],
})
export class CryptographyModule {}
