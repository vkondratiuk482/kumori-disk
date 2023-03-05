import { Provider } from '@nestjs/common';
import { TRANSACTION_CONSTANTS } from '../transaction.constants';
import { TypeormTransactionService } from '../services/typeorm-transaction.service';

export const TransactionServiceProvider: Provider = {
  useClass: TypeormTransactionService,
  provide: TRANSACTION_CONSTANTS.APPLICATION.SERVICE_TOKEN,
};
