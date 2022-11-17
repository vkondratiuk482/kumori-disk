import { FileConsumer } from 'src/file/enums/file-consumer.enum';

export interface UserShareAccessEvent {
	readonly tenantId: string;
  readonly tenantType: FileConsumer;
  readonly fileIds: string[];
}
