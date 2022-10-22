import { InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsString, IsUUID } from 'class-validator';
import { FileConsumer } from 'src/file/enums/file-consumer.enum';
import { UserShareAccess } from '../interfaces/user-share-access.interface';

@InputType()
export class UserShareAccessSchema implements UserShareAccess {
  @IsUUID()
  public readonly tenantId: string;

  @IsEnum(FileConsumer)
  public readonly tenantType: FileConsumer;

  @IsArray()
  @IsString({ each: true })
  public readonly fileIds: string[];
}
