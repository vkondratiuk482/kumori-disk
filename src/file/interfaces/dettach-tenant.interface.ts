import { FileConsumer } from '../enums/file-consumer.enum';
import { FileEntity } from './file-entity.interface';

export interface DettachTenant {
  readonly files: FileEntity[];
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
}
