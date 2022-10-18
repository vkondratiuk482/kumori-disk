import { InputType } from '@nestjs/graphql';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { ShareAccess } from '../interfaces/share-access.interface';

@InputType()
export class ShareAccessSchema implements ShareAccess {
  @IsUUID()
  public readonly tenantId: string;

  @IsArray()
  @IsString({ each: true })
  public readonly fileIds: string[];
}
