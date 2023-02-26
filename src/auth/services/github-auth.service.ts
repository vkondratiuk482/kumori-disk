import { Inject, Injectable } from '@nestjs/common';
import { GITHUB_CONSTANTS } from 'src/github/github.constants';
import { GithubClient } from 'src/github/interfaces/github-client.interface';

@Injectable()
export class GithubAuthService {
  constructor(
    @Inject(GITHUB_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly githubClient: GithubClient,
  ) {}

  public async obtainOAuthAuthorizeURL(): Promise<string> {
    const url = this.githubClient.obtainOAuthAuthorizeURL();

    return url;
  }
}
