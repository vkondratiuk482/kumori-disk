import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, QueryRunner } from 'typeorm';
import { ITransactionService } from '../interfaces/transaction-service.interface';

@Injectable()
export class TypeormTransactionService implements ITransactionService {
  constructor(
    private readonly als: AsyncLocalStorage<QueryRunner>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async start(): Promise<unknown> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    return queryRunner;
  }

  public async commit(): Promise<void> {
    const queryRunner = this.als.getStore();

    if (!queryRunner) {
      throw new Error('Running outside of AsyncLocalStorage context');
    }

    await queryRunner.commitTransaction();

    return queryRunner.release();
  }

  public async rollback(): Promise<void> {
    const queryRunner = this.als.getStore();

    if (!queryRunner) {
      throw new Error('Running outside of AsyncLocalStorage context');
    }

    await queryRunner.rollbackTransaction();

    return queryRunner.release();
  }
}
