export interface File {
  readonly key: string;

  readonly extension: string;

  readonly buffer: Buffer;

  readonly sizeInMb: string;

  readonly description: string;
}
