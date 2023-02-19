import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSONWebToken, HS256Strategy } from '@mokuteki/jwt';
import { JwtTypes } from '../enums/jwt-types.enum';
import { InvalidJwtError } from '../errors/invalid-jwt.error';
import { JwtService } from '../interfaces/jwt-service.interface';
import { JwtOptionsFactory } from '../factories/jwt-options.factory';

@Injectable()
export class HS256JwtServiceImpl implements JwtService {
  private readonly jwt: JSONWebToken;

  constructor(private readonly configService: ConfigService) {
    const options = JwtOptionsFactory.getInstance(JwtTypes.Access);

    this.jwt = new JSONWebToken(
      new HS256Strategy({
        ttl: options.ttl,
        secret: options.secret,
      }),
    );
  }

  public generate(payload: object, type: JwtTypes): string {
    const options = JwtOptionsFactory.getInstance(type);

    const token = this.jwt.generate(payload, {
      ttl: options.ttl,
      secret: options.secret,
    });

    return token;
  }

  public verify<T extends object>(token: string, type: JwtTypes): T {
    try {
      const options = JwtOptionsFactory.getInstance(type);

      const payload = this.jwt.verify<T>(token, {
        ttl: options.ttl,
        secret: options.secret,
      });

      return payload;
    } catch (err) {
      throw new InvalidJwtError();
    }
  }
}