import { Module } from '@nestjs/common';
import { AsyncLocalStorageProvider } from './providers/async-local-storage.provider';

@Module({
  providers: [AsyncLocalStorageProvider],
  exports: [AsyncLocalStorageProvider],
})
export class AlsModule {}
