import { Inject, Injectable } from '@nestjs/common';
import { FILE_FACADE_TOKEN } from 'src/file/constants/file.constants';
import { FileFacade } from 'src/file/interfaces/file-facade.interface';
import { RevokeAccess } from 'src/user/interfaces/revoke-access.interface';
import { ShareAccess } from 'src/user/interfaces/share-access.interface';
import { UploadFile } from 'src/file/interfaces/upload-file.interface';
import { CreateUser } from './interfaces/create-user.interface';
import { UserRepository } from './interfaces/user-repository.interface';

import { User } from './entities/user.entity';
import { USER_REPOSITORY_TOKEN } from './constants/user.constants';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

import { UserNotFoundByEmailError } from './errors/user-not-found-by-email.error';
import { UserNotFoundByUsernameError } from './errors/user-not-found-by-username.error';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';
import { UserExceedsPersonalStorageLimitError } from 'src/file/errors/user-exceeds-personal-storage-limit.error';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(FILE_FACADE_TOKEN)
    private readonly fileFacade: FileFacade,
  ) {}

  public async findSingleById(id: string): Promise<User> {
    const user = await this.userRepository.findSingleById(id);

    return user;
  }

  public async findSingleByIdWithException(id: string): Promise<User> {
    const user = await this.userRepository.findSingleById(id);

    if (!user) {
      throw new UserNotFoundByIdError();
    }

    return user;
  }

  public async findSingleByUsernameWithException(
    username: string,
  ): Promise<User> {
    const user = await this.userRepository.findSingleByUsername(username);

    if (!user) {
      throw new UserNotFoundByUsernameError();
    }

    return user;
  }

  public async findSingleByEmailWithException(email: string): Promise<User> {
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

  public async createSingleForSignUp(data: CreateUser): Promise<User> {
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

  public async uploadSingleFileWithException(
    file: UploadFile,
  ): Promise<string> {
    const bytes = Buffer.byteLength(file.buffer);

    const exceedsPersonalLimit = await this.exceedsPersonalLimit(
      file.ownerId,
      bytes,
    );

    if (exceedsPersonalLimit) {
      throw new UserExceedsPersonalStorageLimitError();
    }

    const key = await this.fileFacade.uploadSingleFileWithException(file);

    return key;
  }

  public async shareAccessWithException(
    ownerId: string,
    data: ShareAccess,
  ): Promise<boolean> {
    const files =
      await this.fileFacade.findManyByIdsAndOwnerIdInDatabaseWithException(
        data.fileIds,
        ownerId,
      );
    const tenant = await this.findSingleByIdWithException(data.tenantId);

    for (const file of files) {
      file.users.push(tenant);
    }

    return this.fileFacade.saveManyInDatabase(files);
  }

  public async revokeAccessWithException(
    ownerId: string,
    data: RevokeAccess,
  ): Promise<boolean> {
    const files =
      await this.fileFacade.findManyByIdsAndOwnerIdInDatabaseWithException(
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

    return this.fileFacade.saveManyInDatabase(files);
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
