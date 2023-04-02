import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LocalSignUpSchema {
  @Field()
  @IsEmail()
  public readonly email: string;

  @Field()
  @IsString()
  public readonly username: string;

  @Field()
  @IsString()
  public readonly password: string;
}
