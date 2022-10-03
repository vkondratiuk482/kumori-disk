import { Field, ObjectType } from '@nestjs/graphql';
import { Model, PartitionKey, SortKey } from '@shiftcoders/dynamo-easy';

@Model()
@ObjectType()
export class UsersFiles {
  @Field()
  @PartitionKey()
  userUuid: string;

  @Field()
  @SortKey()
  fileUuid: string;
}
