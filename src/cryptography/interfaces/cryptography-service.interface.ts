import { EncryptedData } from './encrypted-data.interface';

export interface CryptographyServiceInterface {
  encrypt(data: string): EncryptedData;
  decrypt(data: EncryptedData): string;
  hash(data: string): Promise<string>;
  compareHashed(data: string, hashed: string): Promise<boolean>;
}
