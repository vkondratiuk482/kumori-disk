import { File } from '../entities/file.entity';
import { FileConsumer } from '../enums/file-consumer.enum';

export interface AttachTenant {
  readonly files: File[];
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
}
