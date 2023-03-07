import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, ValidatePromise } from 'class-validator';
import { IUploadGraphQLFile } from '../interfaces/upload-graphql-file.interface';
import { GraphQLFileSchema } from './graphql-file.schema';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class UploadFileSchema implements IUploadGraphQLFile {
  @Field()
  @IsString()
  public readonly path: string;

  @Field(() => GraphQLUpload)
  @ValidatePromise()
  @Type(() => GraphQLFileSchema)
  public readonly file: Promise<GraphQLFileSchema>;
}
