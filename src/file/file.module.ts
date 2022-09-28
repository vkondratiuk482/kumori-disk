import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileServiceProvider } from './providers/file-service.provider';
import { S3ClientProvider } from './providers/s3-client.provider';

@Module({
  imports: [ConfigModule],
  providers: [FileServiceProvider, S3ClientProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
