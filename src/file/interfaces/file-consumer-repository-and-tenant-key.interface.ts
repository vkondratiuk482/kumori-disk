import { ObjectLiteral, Repository } from 'typeorm';

export interface IFileConsumerRepositoryAndTenantKey {
  readonly repository: Repository<ObjectLiteral>;

  readonly tenantKey: string;
}
