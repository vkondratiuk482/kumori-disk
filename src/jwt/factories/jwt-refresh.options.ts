import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtOptionsFactory } from './jwt-options.factory';
import { JwtOptions } from '../interfaces/jwt-options.interface';

@Injectable()
export class JwtRefreshOptions implements JwtOptions {
  public readonly ttl: number;
  public readonly publicKey: string;
  public readonly privateKey: string;

  constructor(configService: ConfigService) {
    const basePath = path.join(process.cwd(), 'src/jwt/keys/refresh-token/');
    const publicKeyPath = path.join(basePath, 'rs256.key.pub');
    const privateKeyPath = path.join(basePath, 'rs256.key');

    this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    this.ttl = parseInt(configService.get<string>('JWT_REFRESH_TTL'));

    JwtOptionsFactory.register(JwtTypes.Refresh, this);
  }
}
