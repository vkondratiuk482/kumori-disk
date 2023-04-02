import { Module } from '@nestjs/common';
import { AlsModule } from 'src/als/als.module';
import { TransactionRunnerProvider } from './providers/transaction-runner.provider';
import { PropagatedTransactionProvider } from './providers/propagated-transaction.provider';

@Module({
  imports: [AlsModule],
  providers: [TransactionRunnerProvider, PropagatedTransactionProvider],
  exports: [PropagatedTransactionProvider],
})
export class TransactionModule {}
