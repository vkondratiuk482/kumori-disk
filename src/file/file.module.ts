import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { FileServiceProvider } from './providers/file-service.provider';
import { S3ClientProvider } from './providers/s3-client.provider';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [FileServiceProvider, S3ClientProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
