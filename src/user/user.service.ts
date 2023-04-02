import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserError } from './errors/user.error';
import { USER_CONSTANTS } from './user.constants';
import { FILE_CONSTANTS } from 'src/file/file.constants';
import { IFile } from 'src/file/interfaces/file.interface';
import { EVENT_CONSTANTS } from 'src/event/event.constants';
import { GITHUB_CONSTANTS } from 'src/github/github.constants';
import { IUserEntity } from './interfaces/user-entity.interface';
import { ICreateUser } from './interfaces/create-user.interface';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { IFileFacade } from 'src/file/interfaces/file-facade.interface';
import { IUploadFile } from 'src/file/interfaces/upload-file.interface';
import { IUserRepository } from './interfaces/user-repository.interface';
import { IUserShareAccess } from './interfaces/user-share-access.interface';
import { IEventService } from 'src/event/interface/event-service.interface';
import { IGithubClient } from 'src/github/interfaces/github-client.interface';
import { IUserRevokeAccess } from './interfaces/user-revoke-access.interface';
import { ILinkGithubAccount } from './interfaces/link-github-account.interface';
import { UserConfirmationStatuses } from './enums/user-confirmation-statuses.enum';
import { IUserShareAccessEvent } from './interfaces/user-share-access-event.interface';
import { IUserRevokeAccessEvent } from './interfaces/user-revoke-access-event.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(FILE_CONSTANTS.APPLICATION.FACADE_TOKEN)
    private readonly fileFacade: IFileFacade,
    @Inject(EVENT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly eventService: IEventService,
    @Inject(GITHUB_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly githubClient: IGithubClient,
  ) {}

  public async findById(id: string): Promise<IUserEntity> {
    const user = await this.userRepository.findById(id);

    return user;
  }

  public async findByIdOrThrow(id: string): Promise<IUserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw UserError.NotFound();
    }

    return user;
  }

  public async findByUsernameOrThrow(username: string): Promise<IUserEntity> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw UserError.NotFound();
    }

    return user;
  }

  public async findByEmail(email: string): Promise<IUserEntity> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }

  public async findByEmailOrThrow(email: string): Promise<IUserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw UserError.NotFound();
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

    return user.diskSpace;
  }

  public async create(data: ICreateUser): Promise<IUserEntity> {
    const user = await this.userRepository.create(data);

    return user;
  }

  public async getOAuthLinkGithubURL(): Promise<string> {
    const redirectURI = `${this.configService.get<string>(
      'APP_PROTOCOL',
    )}://${this.configService.get<string>('APP_DOMAIN')}/user/githubId`;

    const url = this.githubClient.getOAuthAuthorizeURL(redirectURI);

    return url;
  }

  public async linkGithubAccount(
    id: string,
    payload: ILinkGithubAccount,
  ): Promise<boolean> {
    const accessToken = await this.githubClient.getAccessToken(payload.code);

    const githubUser = await this.githubClient.getUser(accessToken);

    const updated = await this.userRepository.updateGithubId(id, githubUser.id);

    return updated;
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
    data: IFile,
  ): Promise<string> {
    const bytes = Buffer.byteLength(data.buffer);

    const exceedsPersonalLimit = await this.exceedsPersonalLimit(
      ownerId,
      bytes,
    );

    if (exceedsPersonalLimit) {
      throw UserError.ExceedsDiskSpace();
    }

    const file: IUploadFile = {
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
    data: IUserShareAccess,
  ): Promise<boolean> {
    const shared = await this.fileFacade.shareAccessWithException({
      ownerId,
      ownerType: FileConsumer.User,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
      fileIds: data.fileIds,
    });

    const payload: IUserShareAccessEvent = {
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
    data: IUserRevokeAccess,
  ): Promise<boolean> {
    const revoked = await this.fileFacade.revokeAccessWithException({
      ownerId,
      ownerType: FileConsumer.User,
      tenantId: data.tenantId,
      tenantType: data.tenantType,
      fileIds: data.fileIds,
    });

    const payload: IUserRevokeAccessEvent = {
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
    const diskSpace = await this.getAvailableStorageSpaceByIdWithException(
      userId,
    );

    const exceedsPersonalLimit = bytes > diskSpace;

    return exceedsPersonalLimit;
  }
}
