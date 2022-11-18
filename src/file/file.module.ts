import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ClientProvider } from './providers/s3-client.provider';
import { FileFacadeProvider } from './providers/file-facade.provider';
import { FileRepositoryProvider } from './providers/file-repository.provider';
import { FileStorageServiceProvider } from './providers/file-storage-service.provider';
import { FileService } from './services/file.service';
import { TypeOrmFileEntityImplementation } from './entities/typeorm-file.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TypeOrmFileEntityImplementation]),
  ],
  providers: [
    FileService,
    S3ClientProvider,
    FileRepositoryProvider,
    FileStorageServiceProvider,
    FileFacadeProvider,
  ],
  exports: [FileFacadeProvider],
})
export class FileModule {}
