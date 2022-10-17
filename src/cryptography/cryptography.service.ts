import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as util from 'node:util';
import * as crypto from 'node:crypto';

import { HASH_KEYLEN, HASH_SEPARATOR } from './cryptography.constants';

import { EncryptedData } from './interfaces/encrypted-data.interface';
import { CryptographyService } from './interfaces/cryptography-service.interface';

@Injectable()
export class CryptographyServiceImplementation implements CryptographyService {
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

  public decrypt(data: EncryptedData): string {
    const key = this.config.get<string>('CRYPTO_KEY');
    const algorithm = this.config.get<string>('CRYPTO_ALGORITHM');

    const decipher = crypto.createDecipheriv(algorithm, key, data.iv);

    const update = decipher.update(data.data, 'hex', 'utf8');
    const final = decipher.final('utf8');

    const decrypted = `${update}${final}`;

    return decrypted;
  }

  public async hash(data: string, salt?: string): Promise<string> {
    salt = salt || crypto.randomBytes(16).toString('hex');

    const buffer: Buffer = (await util.promisify(crypto.scrypt)(
      data,
      salt,
      HASH_KEYLEN,
    )) as Buffer;
    const hashed = `${buffer.toString('hex')}${HASH_SEPARATOR}${salt}`;

    return hashed;
  }

  public async compareHashed(data: string, hashed: string): Promise<boolean> {
    const [hash, salt] = hashed.split(HASH_SEPARATOR);

    const compareHash = await this.hash(data, salt);
    const equivalent = compareHash === hashed;

    return equivalent;
  }
}
