import { JwtTypes } from '../enums/jwt-types.enum';
import { IJwtPair } from './jwt-pair.interface';

export interface IJwtService {
  generate(payload: object, type: JwtTypes): string;

  generatePair(payload: object): IJwtPair;

  verify<T extends object>(token: string, type: JwtTypes): T;
}
