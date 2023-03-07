export interface IGithubGetAccessTokenResponse {
  readonly scope: string;

  readonly token_type: string;

  readonly access_token: string;
}
