import { ITransactionRunner } from '@mokuteki/isolated-transactions';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'node:async_hooks';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TypeormTransactionService
  implements ITransactionRunner<QueryRunner>
{
  constructor(
    private readonly als: AsyncLocalStorage<QueryRunner>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async start(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    return queryRunner;
  }

  public async commit(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();

    return queryRunner.release();
  }

  public async rollback(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.rollbackTransaction();

    return queryRunner.release();
  }
}
