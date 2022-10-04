import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'node:stream';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { UploadFile } from './interfaces/upload-file.interface';
import { MimeType } from './enums/mime-type.enum';

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

  private async streamToBuffer(stream: Stream): Promise<Buffer> {
    const chunks = [];

    return new Promise((resolve, reject) =>
      stream
        .on('data', (data) => chunks.push(data))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(Buffer.concat(chunks))),
    );
  }
}
