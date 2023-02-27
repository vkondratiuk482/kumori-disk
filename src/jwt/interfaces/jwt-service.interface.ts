import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtPair } from './jwt-pair.interface';

export interface JwtService {
  generate(payload: object, type: JwtTypes): string;

  generatePair(payload: object): JwtPair;

  verify<T extends object>(token: string, type: JwtTypes): T;
}
