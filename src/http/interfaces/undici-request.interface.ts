import { Dispatcher } from 'undici';

export interface IUndiciRequest {
  readonly url: string;

  readonly options: Omit<Dispatcher.RequestOptions, 'origin' | 'path'>;
}
