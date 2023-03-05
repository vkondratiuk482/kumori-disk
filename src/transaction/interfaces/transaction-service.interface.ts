export interface ITransactionService {
  start(): Promise<unknown>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
