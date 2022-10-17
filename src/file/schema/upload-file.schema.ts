import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { GraphQLFile } from '../interfaces/graphql-file.interface';
import { UploadGraphQLFile } from '../interfaces/upload-graphql-file.interface';

@InputType()
export class UploadFileSchema implements UploadGraphQLFile {
  @Field()
  @IsString()
  public readonly path: string;

  @Field(() => GraphQLUpload)
  public readonly file: GraphQLFile;
}
