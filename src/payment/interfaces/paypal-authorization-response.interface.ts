export interface IPaypalAuthorizationResponse {
  readonly access_token: string;

  readonly expires_in: number;
}
