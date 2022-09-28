import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { File } from './interfaces/file.interface';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  public async upload(userUuid: string, file: File): Promise<string> {
    const fileUuid = randomUUID();
    const key = `${userUuid}_${fileUuid}.${file.extension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Key: key,
          Body: file.buffer,
          Bucket: this.configService.get<string>('BUCKET_NAME'),
        }),
      );

      return key;
    } catch (err) {
      throw new FileNotUploadedError();
    }
  }
}
