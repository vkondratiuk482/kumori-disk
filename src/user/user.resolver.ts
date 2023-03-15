import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileNotAccessibleError } from 'src/file/errors/file-not-accessible.error';
import { FileNotCreatedInDatabaseError } from 'src/file/errors/file-not-created-in-database.error';
import { FileNotUploadedToStorageError } from 'src/file/errors/file-not-uploaded-to-storage.error';
import { convertGraphQLFileToFile } from 'src/file/file.utils';
import { UploadFileSchema } from 'src/file/schema/upload-file.schema';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';
import { UserService } from './user.service';
import { UserShareAccessSchema } from './schema/user-share-access.schema';
import { UserRevokeAccessSchema } from './schema/user-revoke-access.schema';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';
import { LinkGithubAccountSchema } from './schema/link-github-account.schema';
import { LinkGithubAccountResponse } from './responses/link-github-account.response';
import { IHttpClientRequestError } from 'src/http/errors/http-client-request.error';
import { GetGithubOAuthURLResponse } from 'src/auth/responses/get-github-oauth-url.response';
import { UserError } from './errors/user.error';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetGithubOAuthURLResponse, {
    name: 'getOAuthLinkGithubURL',
  })
  public async getGithubOAuthURL(): Promise<GetGithubOAuthURLResponse> {
    try {
      const url = await this.userService.getOAuthLinkGithubURL();

      const response = new GetGithubOAuthURLResponse(url);

      return response;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, { name: 'uploadSingleFile' })
  public async uploadSingleFile(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UploadFileSchema,
  ): Promise<string> {
    try {
      const file = await convertGraphQLFileToFile(schema);

      const key = await this.userService.uploadSingleFileWithException(
        jwtPayload.id,
        file,
      );

      return key;
    } catch (err) {
      if (
        err instanceof FileNotUploadedToStorageError ||
        err instanceof FileNotCreatedInDatabaseError
      ) {
        throw new ConflictException(err);
      }

      throw new BadRequestException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'userShareAccess' })
  public async shareAccess(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UserShareAccessSchema,
  ): Promise<boolean> {
    try {
      const shared = await this.userService.shareAccessWithException(
        jwtPayload.id,
        schema,
      );

      return shared;
    } catch (err) {
      if (err instanceof FileNotAccessibleError) {
        throw new ForbiddenException(err);
      }
      if (err instanceof UserError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'userRevokeAccess' })
  public async revokeAccess(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UserRevokeAccessSchema,
  ): Promise<boolean> {
    try {
      const revoked = await this.userService.revokeAccessWithException(
        jwtPayload.id,
        schema,
      );

      return revoked;
    } catch (err) {
      if (err instanceof FileNotAccessibleError) {
        throw new ForbiddenException(err);
      }

      throw new BadRequestException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LinkGithubAccountResponse, { name: 'linkGithubAccount' })
  public async linkGithubAccount(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: LinkGithubAccountSchema,
  ): Promise<LinkGithubAccountResponse> {
    try {
      const linked = await this.userService.linkGithubAccount(
        jwtPayload.id,
        schema,
      );

      const response = new LinkGithubAccountResponse(linked);

      return response;
    } catch (err) {
      if (err instanceof IHttpClientRequestError) {
        throw new InternalServerErrorException();
      }

      throw new BadRequestException();
    }
  }
}
