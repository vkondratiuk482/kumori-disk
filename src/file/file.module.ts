import { Module } from '@nestjs/common';
import { FileServiceProvider } from './providers/file-service.provider';

@Module({
  providers: [FileServiceProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
