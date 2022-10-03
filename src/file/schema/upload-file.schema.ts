import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UploadFile } from '../interfaces/upload-file.interface';
import { GraphQLUpload } from 'graphql-upload';
import { GraphQLFile } from '../interfaces/graphql-file.interface';

@InputType()
export class UploadFileSchema implements UploadFile {
  @Field()
  @IsString()
  public readonly path: string;

  @Field(() => GraphQLUpload)
  public readonly file: GraphQLFile;
}
