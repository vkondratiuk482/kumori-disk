import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateUser } from 'src/user/interfaces/create-user.interface';

@InputType()
export class SignUpSchema implements CreateUser {
  @Field()
  @IsString()
  readonly username: string;

  @Field()
  @IsString()
  readonly password: string;
}
