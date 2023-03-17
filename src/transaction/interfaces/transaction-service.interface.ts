export interface ITransactionManager {
  start(): Promise<unknown>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
