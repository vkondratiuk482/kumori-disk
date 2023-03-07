import { IGraphQLFile } from './graphql-file.interface';

export interface IUploadGraphQLFile {
  readonly path: string;

  readonly file: Promise<IGraphQLFile>;
}
