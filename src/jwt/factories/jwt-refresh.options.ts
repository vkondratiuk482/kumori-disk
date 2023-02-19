import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtOptionsFactory } from './jwt-options.factory';
import { JwtOptions } from '../interfaces/jwt-options.interface';

@Injectable()
export class JwtRefreshOptions implements JwtOptions {
  public readonly ttl: number;
  public readonly secret: string;

  constructor(configService: ConfigService) {
    this.ttl = configService.get<number>('JWT_REFRESH_TTL');
    this.secret = configService.get<string>('JWT_REFRESH_SECRET');

    JwtOptionsFactory.register(JwtTypes.Refresh, this);
  }
}
