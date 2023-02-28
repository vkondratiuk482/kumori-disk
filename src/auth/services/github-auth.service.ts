import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { GITHUB_CONSTANTS } from 'src/github/github.constants';
import { JwtPair } from 'src/jwt/interfaces/jwt-pair.interface';
import { GithubClient } from 'src/github/interfaces/github-client.interface';
import { AuthorizeWithGithub } from '../interfaces/authorize-with-github.interface';
import { JwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { UserConfirmationStatuses } from 'src/user/enums/user-confirmation-statuses.enum';
import { CRYPTOGRAPHY_CONSTANTS } from 'src/cryptography/cryptography.constants';
import { CryptographyService } from 'src/cryptography/interfaces/cryptography-service.interface';
import { MAILER_CONSTANTS } from 'src/mailer/mailer.constants';
import { MailerService } from 'src/mailer/interfaces/mailer-service.interface';
import { GithubSignUp } from '../interfaces/github-sign-up.interface';
import { GithubSignIn } from '../interfaces/github-sign-in.interface';
import { GithubIdNotLinkedError } from '../errors/github-id-not-linked.error';
import { GithubIdsDoNotMatchError } from '../errors/github-ids-do-not-match.error';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly userService: UserService,
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
    const url = this.githubClient.obtainOAuthAuthorizeURL();

    return url;
  }

  public async authorize(payload: AuthorizeWithGithub): Promise<JwtPair> {
    const accessToken = await this.githubClient.obtainAccessToken(payload.code);

    const githubUser = await this.githubClient.obtainUser(accessToken);

    const user = await this.userService.findByEmail(githubUser.email);

    if (!user) {
      return this.signUp({
        githubId: githubUser.id,
        email: githubUser.email,
        username: githubUser.login,
      });
    }

    return this.signIn({ user, candidateGithubId: githubUser.id });
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
