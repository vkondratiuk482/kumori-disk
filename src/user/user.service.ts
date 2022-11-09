import { Inject, Injectable } from '@nestjs/common';
import { FILE_FACADE_TOKEN } from 'src/file/constants/file.constants';
import { FileFacade } from 'src/file/interfaces/file-facade.interface';
import { UploadFile } from 'src/file/interfaces/upload-file.interface';
import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

import { USER_REPOSITORY_TOKEN } from './constants/user.constants';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

import { UserNotFoundByEmailError } from './errors/user-not-found-by-email.error';
import { UserNotFoundByUsernameError } from './errors/user-not-found-by-username.error';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';
import { UserExceedsPersonalStorageLimitError } from 'src/file/errors/user-exceeds-personal-storage-limit.error';
import { File } from 'src/file/interfaces/file.interface';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { UserShareAccess } from './interfaces/user-share-access.interface';
import { UserRevokeAccess } from './interfaces/user-revoke-access.interface';
import { UserEntity } from './interfaces/user-entity.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(FILE_FACADE_TOKEN)
    private readonly fileFacade: FileFacade,
  ) {}

  public async findSingleById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findSingleById(id);

    return user;
  }

  public async findSingleByIdWithException(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findSingleById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user;
  }

  public async findSingleByUsernameWithException(
    username: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findSingleByUsername(username);

    if (!user) {
      throw new UserNotFoundByUsernameError();
    }

    return user;
  }

  public async findSingleByEmailWithException(
    email: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findSingleByEmail(email);

    if (!user) {
      throw new UserNotFoundByEmailError();
    }

    return user;
  }

  public async getAvailableStorageSpaceByIdWithException(
    id: string,
  ): Promise<number> {
    const user = await this.userRepository.findSingleById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user.availableStorageSpaceInBytes;
  }

  public async mailUsed(email: string): Promise<boolean> {
    const user = await this.userRepository.findSingleByEmail(email);

    const mailUsed = Boolean(user);

    return mailUsed;
  }

  public async createSingleForSignUp(data: CreateUser): Promise<UserEntity> {
    const user = await this.userRepository.createSinglePending(data);

    return user;
  }

  public async updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatus,
  ): Promise<boolean> {
    const updated = await this.userRepository.updateConfirmationStatus(
      id,
      status,
    );

    return updated;
  }

  public async subtractAvailableSpaceInBytes(
    id: string,
    bytes: number,
  ): Promise<boolean> {
    const subtracted = await this.userRepository.subtractAvailableSpaceInBytes(
      id,
      bytes,
    );

    return subtracted;
  }

  public async uploadSingleFileWithException(
    ownerId: string,
    data: File,
  ): Promise<string> {
    const bytes = Buffer.byteLength(data.buffer);

    const exceedsPersonalLimit = await this.exceedsPersonalLimit(
      ownerId,
      bytes,
    );

    if (exceedsPersonalLimit) {
      throw new UserExceedsPersonalStorageLimitError();
    }

    const file: UploadFile = {
      ownerId,
      path: data.path,
      name: data.name,
      buffer: data.buffer,
      extension: data.extension,
      ownerType: FileConsumer.User,
    };

    // Use transactions
    const key = await this.fileFacade.uploadSingleFileWithException(file);

    await this.subtractAvailableSpaceInBytes(ownerId, bytes);

    return key;
  }

  public async shareAccessWithException(
    ownerId: string,
    data: UserShareAccess,
  ): Promise<boolean> {
    const shared = await this.fileFacade.shareAccessWithException({
      ownerId,
      ownerType: FileConsumer.User,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
      fileIds: data.fileIds,
    });

    return shared;
  }

  public async revokeAccessWithException(
    ownerId: string,
    data: UserRevokeAccess,
  ): Promise<boolean> {
    const revoked = await this.fileFacade.revokeAccessWithException({
      ownerId,
      ownerType: FileConsumer.User,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
      fileIds: data.fileIds,
    });

    return revoked;
  }

  private async exceedsPersonalLimit(
    userId: string,
    bytes: number,
  ): Promise<boolean> {
    const availableStorageSpaceInBytes =
      await this.getAvailableStorageSpaceByIdWithException(userId);

    const exceedsPersonalLimit = bytes > availableStorageSpaceInBytes;

    return exceedsPersonalLimit;
  }
}
