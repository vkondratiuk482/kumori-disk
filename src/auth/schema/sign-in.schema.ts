import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ILocalSignInSchema {
  @Field()
  @IsString()
  public readonly email: string;

  @Field()
  @IsString()
  public readonly password: string;
}
