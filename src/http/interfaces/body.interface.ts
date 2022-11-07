export type Body =
  | { [key: string]: string | number | boolean | object }
  | string
  | Buffer;
