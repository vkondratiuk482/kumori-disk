import { GraphQLFile } from './graphql-file.interface';

export interface UploadFile {
  readonly path: string;

  readonly file: GraphQLFile;
}
