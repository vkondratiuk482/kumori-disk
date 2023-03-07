import { FileConsumer } from '../enums/file-consumer.enum';
import { IFileEntity } from './file-entity.interface';

export interface IAttachTenant {
  readonly files: IFileEntity[];
  readonly tenantId: string;
  readonly tenantType: FileConsumer;
}
