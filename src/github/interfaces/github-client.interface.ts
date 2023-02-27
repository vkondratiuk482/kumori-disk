import { GithubUser } from './github-user.interface';

export interface GithubClient {
  obtainOAuthAuthorizeURL(): string;

  obtainAccessToken(code: string): Promise<string>;

  obtainUser(accessToken: string): Promise<GithubUser>;
}
