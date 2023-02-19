import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILE_CONSTANTS } from '../file.constants';

export const S3ClientProvider: Provider = {
  provide: FILE_CONSTANTS.APPLICATION.S3_CLIENT_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService): S3Client => {
    const region = config.get<string>('BUCKET_REGION');
    const accessKeyId = config.get<string>('BUCKET_ACCESS_KEY');
    const secretAccessKey = config.get<string>('BUCKET_SECRET_KEY');

    const client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return client;
  },
};
