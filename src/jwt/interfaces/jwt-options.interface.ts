export interface IJwtOptions {
  readonly ttl: number;

  readonly publicKey: string;

  readonly privateKey: string;
}
