import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { UploadFile } from './interfaces/upload-file.interface';
import { MimeType } from './enums/mime-type.enum';
import { FileNotDownloadedError } from './errors/file-not-downloaded.error';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { Readable } from 'node:stream';

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

    const extension = MimeType[data.file.mimetype];
    const key = `${userUuid}/${data.path}/${data.file.filename}.${extension}`;
    const fileBuffer = await this.streamToBuffer(data.file.createReadStream());

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

  public async downloadWithException(key: string): Promise<Readable> {
    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand({
          Key: key,
          Bucket: this.configService.get<string>('BUCKET_NAME'),
        }),
      );

      const readStream = Body as Readable;

      return readStream;
    } catch (err) {
      throw new FileNotDownloadedError();
    }
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer: Buffer = Buffer.concat(chunks);

    return buffer;
  }
}
