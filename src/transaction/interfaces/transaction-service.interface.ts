export interface ITransactionService {
  /**
   * Get and store transaction inside of AsyncLocalStorage
   */
  start(): Promise<unknown>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
