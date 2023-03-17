import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { ITransactionRunner } from '@mokuteki/propagated-transactions';

@Injectable()
export class TypeormTransactionRunner
  implements ITransactionRunner<QueryRunner>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

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
