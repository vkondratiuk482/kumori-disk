import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtOptions } from '../interfaces/jwt-options.interface';

export class JwtOptionsFactory {
  static readonly #instances = new Map<string, JwtOptions>();

  public static register(type: JwtTypes, instance: JwtOptions): Promise<void> {
    if (this.#instances.get(type)) {
      return;
    }

    this.#instances.set(type, instance);
  }

  public static getInstance(type: JwtTypes): JwtOptions {
    const instance: JwtOptions = this.#instances.get(type);

    return instance;
  }
}
