import { GraphQLFile } from './graphql-file.interface';

export interface UploadGraphQLFile {
  readonly path: string;

  readonly file: GraphQLFile;
}
