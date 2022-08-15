import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateUser } from 'src/user/interfaces/create-user.interface';

@InputType()
export class SignUpSchema implements CreateUser {
  @Field()
  @IsString()
  public readonly username: string;

  @Field()
  @IsString()
  public readonly password: string;
}
