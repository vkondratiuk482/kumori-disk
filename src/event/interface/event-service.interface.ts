export interface EventService {
  emit<T>(event: string, payload: T): void;
}
