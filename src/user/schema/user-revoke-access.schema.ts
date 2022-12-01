import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { UserRevokeAccess } from '../interfaces/user-revoke-access.interface';

@InputType()
export class UserRevokeAccessSchema implements UserRevokeAccess {
  @IsUUID()
  @Field()
  public readonly tenantId: string;

  @IsEnum(FileConsumer)
  @Field()
  public readonly tenantType: FileConsumer;

  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  public readonly fileIds: string[];
}
