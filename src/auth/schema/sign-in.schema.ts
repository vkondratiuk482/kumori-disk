import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class SignInSchema {
  @Field()
  @IsString()
  readonly username: string;

  @Field()
  @IsString()
  readonly password: string;
}
