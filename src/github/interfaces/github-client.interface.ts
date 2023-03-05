import { GithubUser } from './github-user.interface';

export interface GithubClient {
  getOAuthAuthorizeURL(redirectURI: string): string;

  getAccessToken(code: string): Promise<string>;

  getUser(accessToken: string): Promise<GithubUser>;

  getVerifiedPrimaryEmail(accessToken: string): Promise<string>;
}
