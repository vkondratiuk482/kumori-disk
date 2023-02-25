import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './auth.resolver';
import { MailerModule } from '../mailer/mailer.module';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { CacheModule } from 'src/cache/cache.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [
    JwtModule,
    UserModule,
    CacheModule,
    MailerModule,
    GithubModule,
    CryptographyModule,
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
