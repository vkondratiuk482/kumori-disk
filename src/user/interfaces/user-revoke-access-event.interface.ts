import { FileConsumer } from 'src/file/enums/file-consumer.enum';

export interface IUserRevokeAccessEvent {
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
  readonly fileIds: string[];
}
