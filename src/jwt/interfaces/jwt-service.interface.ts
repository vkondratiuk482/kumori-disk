import { JwtTypes } from '../enums/jwt-types.enum';

export interface JwtService {
  generate(payload: object, type: JwtTypes): string;

  verify<T extends object>(token: string, type: JwtTypes): T;
}
