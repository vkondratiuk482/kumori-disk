import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { LocalSignUpSchema } from './schema/sign-up.schema';
import { LocalSignInSchema } from './schema/sign-in.schema';
import { JwtPairResponse } from './responses/jwt-pair.response';
import { LocalAuthService } from './services/local-auth.service';
import { GithubAuthService } from './services/github-auth.service';
import { ConfirmEmailResponse } from './responses/confirm-email.response';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';
import { AuthorizeWithGithubSchema } from './schema/authorize-with-github.schema';
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
    const url = await this.githubAuthService.getOAuthAuthorizeURL();

    const response = new GetGithubOAuthURLResponse(url);

    return response;
  }

  @Mutation(() => JwtPairResponse, { name: 'authorizeWithGithub' })
  public async authorizeWithGithub(
    @Args('schema') schema: AuthorizeWithGithubSchema,
  ): Promise<JwtPairResponse> {
    const pair = await this.githubAuthService.authorize(schema);

    const response = new JwtPairResponse(pair);

    return response;
  }

  @Mutation(() => UserEntityResponse, { name: 'signUp' })
  public async signUp(
    @Args('schema') schema: LocalSignUpSchema,
  ): Promise<UserEntityResponse> {
    const user = await this.localAuthService.signUp(schema);

    const response = new UserEntityResponse(user);

    return response;
  }

  @Mutation(() => JwtPairResponse, { name: 'signIn' })
  public async signIn(
    @Args('schema') schema: LocalSignInSchema,
  ): Promise<JwtPairResponse> {
    const pair = await this.localAuthService.singIn(schema);

    const response = new JwtPairResponse(pair);

    return response;
  }

  @Mutation(() => ConfirmEmailResponse, { name: 'confirmEmail' })
  public async confirmEmail(
    @Args('hash') hash: string,
  ): Promise<ConfirmEmailResponse> {
    const confirmed = await this.localAuthService.confirmEmail(hash);

    const response = new ConfirmEmailResponse(confirmed);

    return response;
  }

  @Mutation(() => ResendConfirmationEmailResponse, {
    name: 'resendConfirmationEmail',
  })
  public async resendConfirmationEmail(
    @Args('email') email: string,
  ): Promise<ResendConfirmationEmailResponse> {
    const resent = await this.localAuthService.resendConfirmationEmail(email);

    const response = new ResendConfirmationEmailResponse(resent);

    return response;
  }
}
