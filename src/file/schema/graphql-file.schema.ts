import { Readable } from 'node:stream';
import { IsMimeType, IsString } from 'class-validator';
import { IGraphQLFile } from '../interfaces/graphql-file.interface';

export class GraphQLFileSchema implements IGraphQLFile {
  @IsString()
  public readonly filename: string;

  @IsString()
  @IsMimeType()
  public readonly mimetype: string;

  @IsString()
  public readonly encoding: string;

  public readonly createReadStream: () => Readable;
}
