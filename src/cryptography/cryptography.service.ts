import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { CryptographyServiceInterface } from './interfaces/cryptography-service.interface';
import { EncryptedData } from './interfaces/encrypted-data.interface';

@Injectable()
export class CryptographyService implements CryptographyServiceInterface {
  constructor(private readonly config: ConfigService) {}

  public encrypt(data: string): EncryptedData {
    const key = this.config.get<string>('CRYPTO_KEY');
    const algorithm = this.config.get<string>('CRYPTO_ALGORITHM');

    const iv = crypto.randomBytes(16).toString('hex');
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const update = cipher.update(data, 'utf8', 'hex');
    const final = cipher.final('hex');

    const encrypted = `${update}${final}`;

    const encryptedData: EncryptedData = {
      iv,
      data: encrypted,
    };

    return encryptedData;
  }
}
