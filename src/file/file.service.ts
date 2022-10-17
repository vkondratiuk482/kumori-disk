import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from './constants/file.constants';
import { MimeType } from './enums/mime-type.enum';
import { FileNotDownloadedError } from './errors/file-not-downloaded.error';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { Readable } from 'node:stream';
import { GenerateFileKey } from './interfaces/generate-file-key.interface';
import { UserExceedsPersonalStorageLimitError } from './errors/user-exceeds-personal-storage-limit.error';
import { UploadFile } from './interfaces/upload-file.interface';
import { UploadGraphQLFile } from './interfaces/upload-graphql-file.interface';
import { FileService } from './interfaces/file-service.interface';

@Injectable()
export class FileServiceImplementation implements FileService {
  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  public async uploadGraphQLWithException(
    userId: string,
    data: UploadGraphQLFile,
  ): Promise<string> {
    const fileBuffer = await this.convertStreamToBuffer(
      data.file.createReadStream(),
    );
    const bytes = Buffer.byteLength(fileBuffer);

    const exceedsPersonalLimit =
      await this.checkIfUserExceedsPersonalStorageLimit(userId, bytes);

    if (exceedsPersonalLimit) {
      throw new UserExceedsPersonalStorageLimitError();
    }

    const file: UploadFile = {
      userId,
      path: data.path,
      buffer: fileBuffer,
      name: data.file.filename,
      extension: MimeType[data.file.mimetype],
    };
    const key = await this.uploadWithException(file);

    return key;
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

  private async uploadWithException(file: UploadFile): Promise<string> {
    const { userId, extension, path, name, buffer } = file;

    const key = this.generateFileKey({
      name,
      path,
      userId,
      extension,
    });

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Key: key,
          Body: buffer,
          Bucket: this.configService.get<string>('BUCKET_NAME'),
        }),
      );

      return key;
    } catch (err) {
      throw new FileNotUploadedError();
    }
  }

  private generateFileKey(data: GenerateFileKey): string {
    const key = `${data.userId}/${data.path}/${data.name}.${data.extension}`;

    return key;
  }

  private async checkIfUserExceedsPersonalStorageLimit(
    userId: string,
    bytes: number,
  ): Promise<boolean> {
    return true;
  }

  private async convertStreamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer: Buffer = Buffer.concat(chunks);

    return buffer;
  }
}
