import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  FILE_REPOSITORY_TOKEN,
  S3_CLIENT_TOKEN,
} from './constants/file.constants';
import { MimeType } from './enums/mime-type.enum';
import { FileNotDownloadedError } from './errors/file-not-downloaded.error';
import { FileNotUploadedToS3Error } from './errors/file-not-uploaded-to-s3.error';
import { Readable } from 'node:stream';
import { GenerateFileKey } from './interfaces/generate-file-key.interface';
import { UserExceedsPersonalStorageLimitError } from './errors/user-exceeds-personal-storage-limit.error';
import { UploadFile } from './interfaces/upload-file.interface';
import { UploadGraphQLFile } from './interfaces/upload-graphql-file.interface';
import { FileService } from './interfaces/file-service.interface';
import { UserService } from 'src/user/user.service';
import { FileRepository } from './interfaces/file-repository.interface';
import { CreateFile } from './interfaces/create-file.interface';
import { File } from './entities/file.entity';
import { FileNotCreatedInDatabaseError } from './errors/file-not-created-in-database.error';
import { ShareAccess } from './interfaces/share-access.interface';
import { FileNotAccessibleError } from './errors/file-not-accessible.error';
import { RevokeAccess } from './interfaces/revoke-access.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FileServiceImplementation implements FileService {
  constructor(
    @Inject(S3_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
    @Inject(FILE_REPOSITORY_TOKEN)
    private readonly fileRepository: FileRepository,
    private readonly userService: UserService,
  ) {}

  public async uploadGraphQLWithException(
    userId: string,
    data: UploadGraphQLFile,
  ): Promise<string> {
    const fileBuffer = await this.convertStreamToBuffer(
      data.file.createReadStream(),
    );
    const bytes = Buffer.byteLength(fileBuffer);

    const exceedsPersonalLimit = await this.exceedsPersonalLimit(userId, bytes);

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

  public async shareAccessWithException(
    ownerId: string,
    data: ShareAccess,
  ): Promise<boolean> {
    const files = await this.findManyByIdsAndOwnerIdInDatabaseWithException(
      data.fileIds,
      ownerId,
    );
    const tenant = await this.userService.findSingleByIdWithException(
      data.tenantId,
    );

    for (const file of files) {
      file.users.push(tenant);
    }

    return this.saveManyInDatabase(files);
  }

  public async revokeAccessWithException(
    ownerId: string,
    data: RevokeAccess,
  ): Promise<boolean> {
    const files = await this.findManyByIdsAndOwnerIdInDatabaseWithException(
      data.fileIds,
      ownerId,
    );

    for (const file of files) {
      const users: User[] = [];

      for (const user of file.users) {
        if (user.id === data.tenantId) {
          continue;
        }

        users.push(user);
      }

			file.users = users;
    }

    return this.saveManyInDatabase(files);
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
    } catch (err) {
      throw new FileNotUploadedToS3Error();
    }

    try {
      await this.createSingleInDatabase({
        key,
        userId,
        sizeInBytes: Buffer.byteLength(buffer),
      });

      return key;
    } catch (err) {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Key: key,
          Bucket: this.configService.get<string>('BUCKET_NAME'),
        }),
      );

      throw new FileNotCreatedInDatabaseError();
    }
  }

  private async findManyByIdsAndOwnerIdInDatabaseWithException(
    ids: string[],
    ownerId: string,
  ): Promise<File[]> {
    const files = await this.fileRepository.findManyByIds(ids);

    for (const file of files) {
      if (file.ownerId !== ownerId) {
        throw new FileNotAccessibleError();
      }
    }

    return files;
  }

  private async createSingleInDatabase(data: CreateFile): Promise<File> {
    const file = await this.fileRepository.createSingle(data);

    return file;
  }

  private async saveManyInDatabase(files: File[]): Promise<boolean> {
    const saved = await this.fileRepository.saveMany(files);

    return saved;
  }

  private generateFileKey(data: GenerateFileKey): string {
    const key = `${data.userId}/${data.path}/${data.name}.${data.extension}`;

    return key;
  }

  private async exceedsPersonalLimit(
    userId: string,
    bytes: number,
  ): Promise<boolean> {
    const availableStorageSpaceInBytes =
      await this.userService.getAvailableStorageSpaceByIdWithException(userId);

    const exceedsPersonalLimit = bytes > availableStorageSpaceInBytes;

    return exceedsPersonalLimit;
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
