import { JwtTypes } from '../enums/jwt-types.enum';
import { IJwtOptions } from '../interfaces/jwt-options.interface';

export class JwtOptionsFactory {
  private static readonly instances = new Map<string, IJwtOptions>();

  public static register(type: JwtTypes, instance: IJwtOptions): Promise<void> {
    if (this.instances.get(type)) {
      return;
    }

    this.instances.set(type, instance);
  }

  public static getInstance(type: JwtTypes): IJwtOptions {
    const instance: IJwtOptions = this.instances.get(type);

    return instance;
  }
}
