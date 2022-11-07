export interface PaypalAuthorizationResponse {
  readonly access_token: string;

  readonly expires_in: number;
}
