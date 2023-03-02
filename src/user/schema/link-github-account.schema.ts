import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LinkGithubAccountSchema {
  @IsString()
  @Field()
  public readonly code: string;
}
