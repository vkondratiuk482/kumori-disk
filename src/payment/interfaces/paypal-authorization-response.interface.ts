export interface PaypalAuthorizationResponse {
  readonly accessToken: string;

  readonly expires_in: number;
}
