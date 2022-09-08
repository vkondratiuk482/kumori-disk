import { Inject, Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(@Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client) {}
}
