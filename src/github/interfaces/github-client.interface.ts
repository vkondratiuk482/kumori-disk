import { GithubUser } from './github-user.interface';

export interface GithubClient {
  obtainOAuthAuthorizeURL(redirectURI: string): string;

  obtainAccessToken(code: string): Promise<string>;

  obtainUser(accessToken: string): Promise<GithubUser>;

  obtainVerifiedPrimaryEmail(accessToken: string): Promise<string>;
}
