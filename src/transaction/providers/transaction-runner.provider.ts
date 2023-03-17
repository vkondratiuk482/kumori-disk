import { Provider } from '@nestjs/common';
import { TRANSACTION_CONSTANTS } from '../transaction.constants';
import { TypeormTransactionRunner } from '../services/typeorm-transaction.runner';

export const TransactionRunnerProvider: Provider = {
  useClass: TypeormTransactionRunner,
  provide: TRANSACTION_CONSTANTS.APPLICATION.RUNNER_TOKEN,
};
