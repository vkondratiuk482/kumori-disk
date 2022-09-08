import { Module } from '@nestjs/common';
import { FileServiceProvider } from './providers/file-service.provider';
import { S3ClientProvider } from './providers/s3-client.provider';

@Module({
  providers: [FileServiceProvider, S3ClientProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
