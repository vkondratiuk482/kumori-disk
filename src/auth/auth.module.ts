import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MailerModule } from '../mailer/mailer.module';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    MailerModule,
    CacheModule,
    CryptographyModule,
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
