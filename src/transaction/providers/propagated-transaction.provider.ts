import {
  ITransactionRunner,
  PropagatedTransaction,
} from '@mokuteki/propagated-transactions';
import { Provider } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TRANSACTION_CONSTANTS } from '../transaction.constants';

export const PropagatedTransactionProvider: Provider = {
  provide: TRANSACTION_CONSTANTS.APPLICATION.MANAGER_TOKEN,
  useFactory: (
    runner: ITransactionRunner<unknown>,
    als: AsyncLocalStorage<unknown>,
  ): PropagatedTransaction<unknown> => {
    return new PropagatedTransaction(runner, als);
  },
  inject: [TRANSACTION_CONSTANTS.APPLICATION.RUNNER_TOKEN, AsyncLocalStorage],
};
