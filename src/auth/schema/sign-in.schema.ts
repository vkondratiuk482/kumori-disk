import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { SignIn } from '../interfaces/sign-in.interface';

@InputType()
export class SignInSchema implements SignIn {
  @Field()
  @IsString()
  public readonly email: string;

  @Field()
  @IsString()
  public readonly password: string;
}
