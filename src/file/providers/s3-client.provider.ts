import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT_TOKEN } from '../constants/file.constants';

export const S3ClientProvider: Provider = {
  provide: S3_CLIENT_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService): S3Client => {
    const host = config.get<string>('BUCKET_HOST');
    const region = config.get<string>('BUCKET_REGION');
    const accessKeyId = config.get<string>('BUCKET_ACCESS_KEY');
    const secretAccessKey = config.get<string>('BUCKET_SECRET_KEY');

    const endpoint = `https://${region}.${host}.com`;

    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return client;
  },
};
