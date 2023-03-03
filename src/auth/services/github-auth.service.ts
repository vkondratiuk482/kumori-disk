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

    const user = await this.userService.findByEmail(githubEmail);

    if (!user) {
      return this.signUp({
        email: githubEmail,
        githubId: githubUser.id,
        username: githubUser.login,
      });
    }

    const jwtPair: JwtPair = await this.signIn({
      user,
      candidateGithubId: githubUser.id,
    });

    return jwtPair;
  }

  public async signUp(payload: GithubSignUp): Promise<JwtPair> {
    const password = this.cryptographyService.randomUUID();
    const hashedPassword = await this.cryptographyService.hash(password);

    const user = await this.userService.create({
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      githubId: payload.githubId,
      confirmationStatus: UserConfirmationStatuses.Confirmed,
      availableStorageSpaceInBytes:
        USER_CONSTANTS.DOMAIN.DEFAULT_PLAN_AVAILABLE_SIZE_IN_BYTES,
    });

    await this.mailerService.sendGithubGeneratedPassword({
      password,
      receiver: user.email,
    });

    return this.jwtService.generatePair({ id: user.id });
  }

  public async signIn(payload: GithubSignIn): Promise<JwtPair> {
    if (!payload.user.githubId) {
      throw new GithubIdNotLinkedError();
    }

    if (payload.user.githubId !== payload.candidateGithubId) {
      throw new GithubIdsDoNotMatchError();
    }

    return this.jwtService.generatePair({ id: payload.user.id });
  }
}
