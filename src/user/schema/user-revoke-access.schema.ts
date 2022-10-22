import { InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { UserRevokeAccess } from '../interfaces/user-revoke-access.interface';

@InputType()
export class UserRevokeAccessSchema implements UserRevokeAccess {
  @IsUUID()
  public readonly tenantId: string;

  @IsEnum(FileConsumer)
  public readonly tenantType: FileConsumer;

  @IsArray()
  @IsString({ each: true })
  public readonly fileIds: string[];
}
