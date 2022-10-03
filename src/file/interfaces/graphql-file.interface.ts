import { Stream } from 'node:stream';

export interface GraphQLFile {
  readonly filename: string;

  readonly mimetype: string;

  readonly encoding: string;

  readonly createReadStream: () => Stream;
}
