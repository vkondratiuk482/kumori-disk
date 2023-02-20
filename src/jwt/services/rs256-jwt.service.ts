import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSONWebToken, RS256Strategy } from '@mokuteki/jwt';
import { JwtTypes } from '../enums/jwt-types.enum';
import { InvalidJwtError } from '../errors/invalid-jwt.error';
import { JwtService } from '../interfaces/jwt-service.interface';
import { JwtOptionsFactory } from '../factories/jwt-options.factory';

@Injectable()
export class RS256JwtServiceImpl implements JwtService {
  private readonly jwt: JSONWebToken;

  constructor(private readonly configService: ConfigService) {
    const options = JwtOptionsFactory.getInstance(JwtTypes.Access);

    this.jwt = new JSONWebToken(new RS256Strategy(options));
  }

  public generate(payload: object, type: JwtTypes): string {
    const options = JwtOptionsFactory.getInstance(type);

    const token = this.jwt.generate(payload, options);

    return token;
  }

  public verify<T extends object>(token: string, type: JwtTypes): T {
    try {
      const options = JwtOptionsFactory.getInstance(type);

      const payload = this.jwt.verify<T>(token, options);

      return payload;
    } catch (err) {
      throw new InvalidJwtError();
    }
  }
}
