import { FileConsumer } from 'src/file/enums/file-consumer.enum';

export interface IUserShareAccessEvent {
	readonly tenantId: string;
  readonly tenantType: FileConsumer;
  readonly fileIds: string[];
}
