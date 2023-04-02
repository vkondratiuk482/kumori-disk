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
import { FileError } from '../errors/file.error';
import { FILE_CONSTANTS } from '../file.constants';
import { IUploadFile } from '../interfaces/upload-file.interface';
import { IGenerateFileKey } from '../interfaces/generate-file-key.interface';

export class S3FileStorageService /*implements IFileStorageService */ {
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(FILE_CONSTANTS.APPLICATION.S3_CLIENT_TOKEN)
    private readonly s3Client: S3Client,
  ) {
    this.bucket = configService.get<string>('BUCKET_NAME');
  }

  public async uploadSingleWithException(file: IUploadFile): Promise<string> {
    const { ownerId, path, name, buffer } = file;

    const key = this.generateFileKey({
      name,
      path,
      ownerId,
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
      throw FileError.ActionNotPerformed();
    }
  }

  public async uploadManyWithException(file: IUploadFile[]): Promise<string[]> {
    return [];
  }

  public async copySingleWithException(
    sourceFileKey: string,
    copyPath: string,
  ): Promise<string> {
    try {
      const key = this.modifyFileKeyPath(sourceFileKey, copyPath);

      await this.s3Client.send(
        new CopyObjectCommand({
          Key: key,
          CopySource: sourceFileKey,
          Bucket: this.bucket,
        }),
      );

      return key;
    } catch (err) {
      throw FileError.ActionNotPerformed();
    }
  }

  public async renameSingleWithException(
    sourceFileKey: string,
    name: string,
  ): Promise<string> {
    try {
      const key = this.modifyFileKeyName(sourceFileKey, name);

      await this.s3Client.send(
        new CopyObjectCommand({
          Key: key,
          CopySource: sourceFileKey,
          Bucket: this.bucket,
        }),
      );

      await this.s3Client.send(
        new DeleteObjectCommand({
          Key: sourceFileKey,
          Bucket: this.bucket,
        }),
      );

      return key;
    } catch (err) {
      throw FileError.ActionNotPerformed();
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
      throw FileError.ActionNotPerformed();
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

  private generateFileKey(data: IGenerateFileKey): string {
    const key = `${data.ownerId}/${data.path}/${data.name}`;

    return key;
  }

  private modifyFileKeyPath(key: string, newPath: string): string {
    const [ownerId, ...path] = key.split('/');
    const file = path[path.length - 1];

    const name = file.split('.')[0];

    const newKey = this.generateFileKey({
      name,
      ownerId,
      path: newPath,
    });

    return newKey;
  }

  private modifyFileKeyName(key: string, newName: string): string {
    const [ownerId, ...pathWithName] = key.split('/');
    const path = pathWithName.slice(0, pathWithName.length - 1).join('/');

    const newKey = this.generateFileKey({
      name: newName,
      ownerId,
      path,
    });

    return newKey;
  }
}
