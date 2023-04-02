import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { convertGraphQLFileToFile } from 'src/file/file.utils';
import { UploadFileSchema } from 'src/file/schema/upload-file.schema';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { UserShareAccessSchema } from './schema/user-share-access.schema';
import { UserRevokeAccessSchema } from './schema/user-revoke-access.schema';
import { LinkGithubAccountSchema } from './schema/link-github-account.schema';
import { IJwtPayloadDecorator } from 'src/jwt/decorators/jwt-payload.decorator';
import { LinkGithubAccountResponse } from './responses/link-github-account.response';
import { GetGithubOAuthURLResponse } from 'src/auth/responses/get-github-oauth-url.response';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => GetGithubOAuthURLResponse, {
    name: 'getOAuthLinkGithubURL',
  })
  public async getGithubOAuthURL(): Promise<GetGithubOAuthURLResponse> {
    const url = await this.userService.getOAuthLinkGithubURL();

    const response = new GetGithubOAuthURLResponse(url);

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, { name: 'uploadSingleFile' })
  public async uploadSingleFile(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UploadFileSchema,
  ): Promise<string> {
    const file = await convertGraphQLFileToFile(schema);

    const key = await this.userService.uploadSingleFileWithException(
      jwtPayload.id,
      file,
    );

    return key;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'userShareAccess' })
  public async shareAccess(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UserShareAccessSchema,
  ): Promise<boolean> {
    const shared = await this.userService.shareAccessWithException(
      jwtPayload.id,
      schema,
    );

    return shared;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'userRevokeAccess' })
  public async revokeAccess(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: UserRevokeAccessSchema,
  ): Promise<boolean> {
    const revoked = await this.userService.revokeAccessWithException(
      jwtPayload.id,
      schema,
    );

    return revoked;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LinkGithubAccountResponse, { name: 'linkGithubAccount' })
  public async linkGithubAccount(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('schema') schema: LinkGithubAccountSchema,
  ): Promise<LinkGithubAccountResponse> {
    const linked = await this.userService.linkGithubAccount(
      jwtPayload.id,
      schema,
    );

    const response = new LinkGithubAccountResponse(linked);

    return response;
  }
}
