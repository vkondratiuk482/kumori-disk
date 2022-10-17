import { IsString } from 'class-validator';
import { Readable } from 'node:stream';
import { GraphQLFile } from '../interfaces/graphql-file.interface';

export class GraphQLFileSchema implements GraphQLFile {
  @IsString()
  public readonly filename: string;

  @IsString()
  public readonly mimetype: string;

  @IsString()
  public readonly encoding: string;

  public readonly createReadStream: () => Readable;
}
