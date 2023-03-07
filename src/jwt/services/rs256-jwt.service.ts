import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSONWebToken, RS256Strategy } from '@mokuteki/jwt';
import { JwtTypes } from '../enums/jwt-types.enum';
import { InvalidJwtError } from '../errors/invalid-jwt.error';
import { IJwtService } from '../interfaces/jwt-service.interface';
import { IJwtOptionsFactory } from '../factories/jwt-options.factory';
import { IJwtPair } from '../interfaces/jwt-pair.interface';

@Injectable()
export class RS256JwtService implements IJwtService {
  private readonly jwt: JSONWebToken;

  constructor(private readonly configService: ConfigService) {
    const options = IJwtOptionsFactory.getInstance(JwtTypes.Access);

    this.jwt = new JSONWebToken(new RS256Strategy(options));
  }

  public generate(payload: object, type: JwtTypes): string {
    const options = IJwtOptionsFactory.getInstance(type);

    const token = this.jwt.generate(payload, options);

    return token;
  }

  public generatePair(payload: object): IJwtPair {
    const pair: IJwtPair = {
      accessToken: this.generate(payload, JwtTypes.Access),
      refreshToken: this.generate(payload, JwtTypes.Refresh),
    };

    return pair;
  }

  public verify<T extends object>(token: string, type: JwtTypes): T {
    try {
      const options = IJwtOptionsFactory.getInstance(type);

      const payload = this.jwt.verify<T>(token, options);

      return payload;
    } catch (err) {
      throw new InvalidJwtError();
    }
  }
}
