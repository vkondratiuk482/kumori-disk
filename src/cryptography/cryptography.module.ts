import { Module } from '@nestjs/common';
import { CryptographyServiceProvider } from './providers/cryptography-service.provider';

@Module({
  providers: [CryptographyServiceProvider],
  exports: [CryptographyServiceProvider],
})
export class CryptographyModule {}
