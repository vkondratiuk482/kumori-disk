export interface JwtOptions {
  readonly publicKey: string;

  readonly privateKey: string;

  readonly ttl: number;
}
