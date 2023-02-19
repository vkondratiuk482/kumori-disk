export interface JwtOptions {
  readonly ttl: number;

  readonly secret: string;
}
