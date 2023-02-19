import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MailerModule } from '../mailer/mailer.module';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { CacheModule } from 'src/cache/cache.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [
    JwtModule,
    UserModule,
    CacheModule,
    MailerModule,
    CryptographyModule,
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
