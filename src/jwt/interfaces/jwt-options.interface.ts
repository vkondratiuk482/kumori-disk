export interface JwtOptions {
  readonly ttl: number;

  readonly publicKey: string;

  readonly privateKey: string;
}
