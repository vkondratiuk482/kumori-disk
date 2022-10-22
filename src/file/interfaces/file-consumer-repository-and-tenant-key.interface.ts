import { ObjectLiteral, Repository } from 'typeorm';

export interface FileConsumerRepositoryAndTenantKey {
  readonly repository: Repository<ObjectLiteral>;

  readonly tenantKey: string;
}
