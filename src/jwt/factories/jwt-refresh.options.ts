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
    this.secret = configService.get<string>('JWT_REFRESH_SECRET');
    this.ttl = parseInt(configService.get<string>('JWT_REFRESH_TTL'));

    JwtOptionsFactory.register(JwtTypes.Refresh, this);
  }
}
