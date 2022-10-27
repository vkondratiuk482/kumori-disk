import { FileConsumer } from '../enums/file-consumer.enum';
import { FileEntity } from './file-entity.interface';

export interface AttachTenant {
  readonly files: FileEntity[];
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
}
