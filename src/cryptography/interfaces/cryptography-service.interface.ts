import { IEncryptedData } from './encrypted-data.interface';

export interface ICryptographyService {
  encrypt(data: string): IEncryptedData;

  decrypt(data: IEncryptedData): string;

  hash(data: string, salt?: string): Promise<string>;

  compareHashed(data: string, hashed: string): Promise<boolean>;

  randomUUID(): string;
}
