import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { FileNotUploadedToStorageError } from '../errors/file-not-uploaded-to-storage.error';
import { FileNotDownloadedError } from '../errors/file-not-downloaded.error';
import { S3_CLIENT_TOKEN } from '../constants/file.constants';
import { UploadFile } from '../interfaces/upload-file.interface';
import { GenerateFileKey } from '../interfaces/generate-file-key.interface';
import { FileStorageService } from '../interfaces/file-storage-service.interface';
import { FileNotCopiedInStorageError } from '../errors/file-not-copied-in-storage.error';

export class S3FileStorageServiceImplementation implements FileStorageService {
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucket = configService.get<string>('BUCKET_NAME');
  }

  public async uploadSingleWithException(file: UploadFile): Promise<string> {
    const { ownerId, extension, path, name, buffer } = file;

    const key = this.generateFileKey({
      name,
      path,
      ownerId,
      extension,
    });

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Key: key,
          Body: buffer,
          Bucket: this.bucket,
        }),
      );

      return key;
    } catch (err) {
      throw new FileNotUploadedToStorageError();
    }
  }

  public async uploadManyWithException(file: UploadFile[]): Promise<string[]> {
    return [];
  }

  public async copySingleWithException(
    soureFileKey: string,
    copyPath: string,
  ): Promise<boolean> {
    try {
      await this.s3Client.send(
        new CopyObjectCommand({
          CopySource: soureFileKey,
          Key: copyPath,
          Bucket: this.bucket,
        }),
      );

      return true;
    } catch (err) {
      throw new FileNotCopiedInStorageError();
    }
  }

  public async downloadSingleWithException(key: string): Promise<Readable> {
    try {
      const { Body } = await this.s3Client.send(
        new GetObjectCommand({
          Key: key,
          Bucket: this.bucket,
        }),
      );

      const readStream = Body as Readable;

      return readStream;
    } catch (err) {
      throw new FileNotDownloadedError();
    }
  }

  public async deleteOne(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Key: key,
          Bucket: this.bucket,
        }),
      );

      return true;
    } catch (err) {
      return false;
    }
  }

  private generateFileKey(data: GenerateFileKey): string {
    const key = `${data.ownerId}/${data.path}/${data.name}.${data.extension}`;

    return key;
  }
}
