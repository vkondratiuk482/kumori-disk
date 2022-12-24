import { Dispatcher } from 'undici';

export interface UndiciRequest {
  readonly url: string;

  readonly options: Omit<Dispatcher.RequestOptions, 'origin' | 'path'>;
}
