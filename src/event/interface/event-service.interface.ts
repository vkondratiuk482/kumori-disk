export interface IEventService {
  emit<T>(event: string, payload: T): void;
}
