import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Model, PartitionKey } from '@shiftcoders/dynamo-easy';
import { UserConfirmationStatus } from './enums/user-confirmation-status.enum';

@Model()
@ObjectType()
export class User {
  @Field()
  @PartitionKey()
  uuid: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @HideField()
  password: string;

  @HideField()
  confirmationStatus: UserConfirmationStatus;
}
