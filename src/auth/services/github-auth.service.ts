import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { USER_CONSTANTS } from 'src/user/user.constants';
import { MAILER_CONSTANTS } from 'src/mailer/mailer.constants';
import { GITHUB_CONSTANTS } from 'src/github/github.constants';
import { JwtPair } from 'src/jwt/interfaces/jwt-pair.interface';
import { GithubSignUp } from '../interfaces/github-sign-up.interface';
import { GithubSignIn } from '../interfaces/github-sign-in.interface';
import { JwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { GithubClient } from 'src/github/interfaces/github-client.interface';
import { GithubIdNotLinkedError } from '../errors/github-id-not-linked.error';
import { MailerService } from 'src/mailer/interfaces/mailer-service.interface';
import { CRYPTOGRAPHY_CONSTANTS } from 'src/cryptography/cryptography.constants';
import { GithubIdsDoNotMatchError } from '../errors/github-ids-do-not-match.error';
import { AuthorizeWithGithub } from '../interfaces/authorize-with-github.interface';
import { UserConfirmationStatuses } from 'src/user/enums/user-confirmation-statuses.enum';
import { CryptographyService } from 'src/cryptography/interfaces/cryptography-service.interface';
import { AUTH_CONSTANTS } from '../auth.constants';
import { UsersAuthProvidersRepository } from '../interfaces/users-auth-providers-repository.interface';
import { AuthProviders } from '../enums/auth-providers.enum';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: JwtService,
    @Inject(GITHUB_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly githubClient: GithubClient,
    @Inject(CRYPTOGRAPHY_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cryptographyService: CryptographyService,
    @Inject(MAILER_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly mailerService: MailerService,
    @Inject(AUTH_CONSTANTS.APPLICATION.USERS_AUTH_PROVIDERS_REPOSITORY_TOKEN)
    private readonly usersAuthProvidersRepository: UsersAuthProvidersRepository,
  ) {}

  public async obtainOAuthAuthorizeURL(): Promise<string> {
    const redirectURI = `${this.configService.get<string>(
      'APP_PROTOCOL',
    )}://${this.configService.get<string>('APP_DOMAIN')}/auth/github`;

    const url = this.githubClient.obtainOAuthAuthorizeURL(redirectURI);

    return url;
  }

  public async authorize(payload: AuthorizeWithGithub): Promise<JwtPair> {
    const accessToken = await this.githubClient.obtainAccessToken(payload.code);

    const githubUser = await this.githubClient.obtainUser(accessToken);
    const githubEmail = await this.githubClient.obtainVerifiedPrimaryEmail(
      accessToken,
    );

    /**
     * Propagate the transaction using AsyncLocalStorage
     */
    const user = await this.userService.findByEmail(githubEmail);
    const usersAuthProviders =
      await this.usersAuthProvidersRepository.findByUserIdAndProvider(
        user.id,
        AuthProviders.Github,
      );

    if (!user) {
      return this.signUp({
        email: githubEmail,
        githubId: githubUser.id,
        username: githubUser.login,
      });
    }

    const jwtPair: JwtPair = await this.signIn({
      userId: user.id,
      candidateGithubId: githubUser.id,
      userGithubId: usersAuthProviders.providerUserId,
    });

    return jwtPair;
  }

  public async signUp(payload: GithubSignUp): Promise<JwtPair> {
    const password = this.cryptographyService.randomUUID();
    const hashedPassword = await this.cryptographyService.hash(password);

    /**
     * Propagate the transaction using AsyncLocalStorage
     */
    const user = await this.userService.create({
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      confirmationStatus: UserConfirmationStatuses.Confirmed,
      diskSpace: USER_CONSTANTS.DOMAIN.DEFAULT_PLAN_AVAILABLE_SIZE_IN_BYTES,
    });

    /**
     * Create usersAuthProviders record for the user
     */

    await this.mailerService.sendGithubGeneratedPassword({
      password,
      receiver: user.email,
    });

    return this.jwtService.generatePair({ id: user.id });
  }

  public async signIn(payload: GithubSignIn): Promise<JwtPair> {
    if (!payload.userGithubId) {
      throw new GithubIdNotLinkedError();
    }

    if (payload.userGithubId !== String(payload.candidateGithubId)) {
      throw new GithubIdsDoNotMatchError();
    }

    return this.jwtService.generatePair({ id: payload.userId });
  }
}
