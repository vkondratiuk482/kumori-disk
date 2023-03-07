export interface ICacheService {
  get<T>(key: string): Promise<T>;

  set<T>(key: string, value: T, ttl: number): Promise<T>;

  delete(key: string): Promise<void>;
}
