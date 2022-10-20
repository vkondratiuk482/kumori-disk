import { InputType } from '@nestjs/graphql';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { RevokeAccess } from '../interfaces/revoke-access.interface';

@InputType()
export class RevokeAccessSchema implements RevokeAccess {
  @IsUUID()
  public readonly tenantId: string;

  @IsArray()
  @IsString({ each: true })
  public readonly fileIds: string[];
}
