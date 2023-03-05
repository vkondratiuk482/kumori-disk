import { Module } from '@nestjs/common';
import { AlsModule } from 'src/als/als.module';
import { TransactionServiceProvider } from './providers/transaction-service.provider';

@Module({
  imports: [AlsModule],
  providers: [TransactionServiceProvider],
  exports: [TransactionServiceProvider],
})
export class TransactionModule {}
