import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'node:stream';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { UploadFile } from './interfaces/upload-file.interface';

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  public async uploadWithException(
    userUuid: string,
    data: UploadFile,
  ): Promise<string> {
    // condition to check whether user has exceeded personal storage limit

    const key = `${userUuid}/${data.path}/${data.file.filename}.${data.file.mimetype}`;

    const fileBuffer = this.streamToBuffer(data.file.createReadStream());

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Key: key,
          Body: fileBuffer,
          Bucket: this.configService.get<string>('BUCKET_NAME'),
        }),
      );

      return key;
    } catch (err) {
      throw new FileNotUploadedError();
    }
  }

  private streamToBuffer(stream: Stream): Buffer {
    // convert stream to buffer
  }
}
