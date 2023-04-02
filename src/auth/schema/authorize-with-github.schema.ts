import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthorizeWithGithubSchema {
  @Field()
  @IsString()
  public readonly code: string;
}
