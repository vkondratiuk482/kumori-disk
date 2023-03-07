import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';

@InputType()
export class UserRevokeAccessSchema {
  @IsUUID()
  @Field()
  public readonly tenantId: string;

  @IsEnum(FileConsumer)
  @Field()
  public readonly tenantType: FileConsumer;

  @IsArray()
  @IsUUID(4, { each: true })
  @Field(() => [String])
  public readonly fileIds: string[];
}
