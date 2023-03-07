import { FileConsumer } from '../enums/file-consumer.enum';

export interface IRevokeAccess {
  readonly ownerId: string;
  readonly ownerType: FileConsumer;
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
  readonly fileIds: string[];
}
