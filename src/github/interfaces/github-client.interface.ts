import { IGithubUser } from './github-user.interface';

export interface IGithubClient {
  getOAuthAuthorizeURL(redirectURI: string): string;

  getAccessToken(code: string): Promise<string>;

  getUser(accessToken: string): Promise<IGithubUser>;

  getVerifiedPrimaryEmail(accessToken: string): Promise<string>;
}
