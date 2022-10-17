import { Field, InputType } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { UploadGraphQLFile } from '../interfaces/upload-graphql-file.interface';
import { GraphQLFileSchema } from './graphql-file.schema';

@InputType()
export class UploadFileSchema implements UploadGraphQLFile {
  @Field()
  @IsString()
  public readonly path: string;

  @Field(() => GraphQLUpload)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => GraphQLFileSchema)
  public readonly file: GraphQLFileSchema;
}
