import { Inject, Injectable } from '@nestjs/common';
import { FileFacade } from 'src/file/interfaces/file-facade.interface';
import { UploadFile } from 'src/file/interfaces/upload-file.interface';
import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

import { UserNotFoundByEmailError } from './errors/user-not-found-by-email.error';
import { UserNotFoundByUsernameError } from './errors/user-not-found-by-username.error';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';
import { UserExceedsPersonalStorageLimitError } from 'src/file/errors/user-exceeds-personal-storage-limit.error';
import { File } from 'src/file/interfaces/file.interface';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { UserShareAccess } from './interfaces/user-share-access.interface';
import { UserRevokeAccess } from './interfaces/user-revoke-access.interface';
import { UserEntity } from './interfaces/user-entity.interface';
import { EventService } from 'src/event/interface/event-service.interface';
import { UserShareAccessEvent } from './interfaces/user-share-access-event.interface';
import { UserRevokeAccessEvent } from './interfaces/user-revoke-access-event.interface';
import { USER_CONSTANTS } from './user.constants';
import { FILE_CONSTANTS } from 'src/file/file.constants';
import { EVENT_CONSTANTS } from 'src/event/event.constants';
import { UserConfirmationStatuses } from './enums/user-confirmation-statuses.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(FILE_CONSTANTS.APPLICATION.FACADE_TOKEN)
    private readonly fileFacade: FileFacade,
    @Inject(EVENT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly eventService: EventService,
  ) {}

  public async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    return user;
  }

  public async findByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user;
  }

  public async findByUsernameOrThrow(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new UserNotFoundByUsernameError();
    }

    return user;
  }

  public async findByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundByEmailError();
    }

    return user;
  }

  public async existsById(id: string): Promise<boolean> {
    const exists = await this.userRepository.existsById(id);

    return exists;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.existsByEmail(email);

    return exists;
  }

  public async getAvailableStorageSpaceByIdWithException(
    id: string,
  ): Promise<number> {
    const user = await this.findByIdOrThrow(id);

    return user.availableStorageSpaceInBytes;
  }

  public async create(data: CreateUser): Promise<UserEntity> {
    const user = await this.userRepository.create(data);

    return user;
  }

  public async updateConfirmationStatus(
    id: string,
    status: UserConfirmationStatuses,
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

    const payload: UserShareAccessEvent = {
      fileIds: data.fileIds,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
    };
    this.eventService.emit(
      USER_CONSTANTS.APPLICATION.SHARE_ACCESS_EVENT,
      payload,
    );

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

    const payload: UserRevokeAccessEvent = {
      fileIds: data.fileIds,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
    };
    this.eventService.emit(
      USER_CONSTANTS.APPLICATION.REVOKE_ACCESS_EVENT,
      payload,
    );

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
