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
import { JwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';

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

    const emailExists = await this.userService.existsByEmail(githubUser.email);

    if (!emailExists) {
      const password = this.cryptographyService.randomUUID();
      const hashedPassword = await this.cryptographyService.hash(password);

      const user = await this.userService.create({
        email: githubUser.email,
        password: hashedPassword,
        username: githubUser.login,
        confirmationStatus: UserConfirmationStatuses.Confirmed,
      });

      await this.mailerService.sendGithubGeneratedPassword({
        password,
        receiver: user.email,
      });

      const jwtPayload: JwtPayload = {
        id: user.id,
      };
      const jwtPair = this.jwtService.generatePair(jwtPayload);

      return jwtPair;
    }

    const pair = this.jwtService.generatePair({});

    return pair;
  }
}
