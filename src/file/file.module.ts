import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { File } from './entities/file.entity';
import { FileRepositoryProvider } from './providers/file-repository.provider';
import { FileServiceProvider } from './providers/file-service.provider';
import { S3ClientProvider } from './providers/s3-client.provider';

@Module({
  imports: [ConfigModule, UserModule, TypeOrmModule.forFeature([File])],
  providers: [FileRepositoryProvider, FileServiceProvider, S3ClientProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
