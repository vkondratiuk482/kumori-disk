import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { EmailNotConfirmedError } from './errors/email-not-confirmed.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';
import { EmailAlreadyConfirmedError } from './errors/email-already-confirmed.error';
import { InvalidConfirmationHashError } from './errors/invalid-confirmation-hash.error';

import { ILocalSignUpSchema } from './schema/sign-up.schema';
import { ILocalSignInSchema } from './schema/sign-in.schema';

import { LocalAuthService } from './services/local-auth.service';
import { IJwtPairResponse } from './responses/jwt-pair.response';
import { GithubAuthService } from './services/github-auth.service';
import { ConfirmEmailResponse } from './responses/confirm-email.response';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';
import { GithubIdNotLinkedError } from './errors/github-id-not-linked.error';
import { GithubIdsDoNotMatchError } from './errors/github-ids-do-not-match.error';
import { IAuthorizeWithGithubSchema } from './schema/authorize-with-github.schema';
import { GetGithubOAuthURLResponse } from './responses/get-github-oauth-url.response';
import { ResendConfirmationEmailResponse } from './responses/resend-confirmation-email.response';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly localAuthService: LocalAuthService,
    private readonly githubAuthService: GithubAuthService,
  ) {}

  @Query(() => GetGithubOAuthURLResponse, {
    name: 'getOAuthAuthorizeGithubURL',
  })
  public async getGithubOAuthURL(): Promise<GetGithubOAuthURLResponse> {
    try {
      const url = await this.githubAuthService.getOAuthAuthorizeURL();

      const response = new GetGithubOAuthURLResponse(url);

      return response;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  @Mutation(() => IJwtPairResponse, { name: 'authorizeWithGithub' })
  public async authorizeWithGithub(
    @Args('schema') schema: IAuthorizeWithGithubSchema,
  ): Promise<IJwtPairResponse> {
    try {
      const pair = await this.githubAuthService.authorize(schema);

      const response = new IJwtPairResponse(pair);

      return response;
    } catch (err) {
      if (
        err instanceof GithubIdNotLinkedError ||
        err instanceof GithubIdsDoNotMatchError
      ) {
        throw new UnauthorizedException(err.message);
      }

      throw new BadRequestException();
    }
  }

  @Mutation(() => UserEntityResponse, { name: 'signUp' })
  public async signUp(
    @Args('schema') schema: ILocalSignUpSchema,
  ): Promise<UserEntityResponse> {
    try {
      const user = await this.localAuthService.signUp(schema);

      const response = new UserEntityResponse(user);

      return response;
    } catch (err) {
      if (err instanceof MailIsInUseError) {
        throw new ConflictException(err);
      }

      throw new BadRequestException();
    }
  }

  @Mutation(() => IJwtPairResponse, { name: 'signIn' })
  public async signIn(
    @Args('schema') schema: ILocalSignInSchema,
  ): Promise<IJwtPairResponse> {
    const pair = await this.localAuthService.singIn(schema);

    const response = new IJwtPairResponse(pair);

    return response;
  }

  @Mutation(() => ConfirmEmailResponse, { name: 'confirmEmail' })
  public async confirmEmail(
    @Args('hash') hash: string,
  ): Promise<ConfirmEmailResponse> {
    try {
      const confirmed = await this.localAuthService.confirmEmail(hash);

      const response = new ConfirmEmailResponse(confirmed);

      return response;
    } catch (err) {
      if (
        err instanceof InvalidConfirmationHashError ||
        err instanceof EmailAlreadyConfirmedError
      ) {
        throw new ConflictException(err);
      }
      if (err instanceof UserError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException();
    }
  }

  @Mutation(() => ResendConfirmationEmailResponse, {
    name: 'resendConfirmationEmail',
  })
  public async resendConfirmationEmail(
    @Args('email') email: string,
  ): Promise<ResendConfirmationEmailResponse> {
    try {
      const resent = await this.localAuthService.resendConfirmationEmail(email);

      const response = new ResendConfirmationEmailResponse(resent);

      return response;
    } catch (err) {
      if (err instanceof EmailAlreadyConfirmedError) {
        throw new ConflictException(err);
      }
      if (err instanceof UserError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException();
    }
  }
}
