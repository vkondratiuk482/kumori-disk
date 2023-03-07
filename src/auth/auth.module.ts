import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsModule } from 'src/als/als.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { CacheModule } from 'src/cache/cache.module';
import { MailerModule } from '../mailer/mailer.module';
import { GithubModule } from 'src/github/github.module';
import { LocalAuthService } from './services/local-auth.service';
import { GithubAuthService } from './services/github-auth.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { TypeormAuthProviderEntity } from './entities/typeorm-auth-provider.entity';
import { TypeormUsersAuthProvidersEntity } from './entities/typeorm-users-auth-providers.entity';
import { UsersAuthProvidersRepositoryProvider } from './providers/users-auth-providers-repository.provider';
import { AuthProviderRepositoryProvider } from './providers/auth-provider-repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeormAuthProviderEntity,
      TypeormUsersAuthProvidersEntity,
    ]),
    AlsModule,
    JwtModule,
    UserModule,
    CacheModule,
    MailerModule,
    GithubModule,
    TransactionModule,
    CryptographyModule,
  ],
  providers: [
    LocalAuthService,
    AuthResolver,
    GithubAuthService,
    AuthProviderRepositoryProvider,
    UsersAuthProvidersRepositoryProvider,
  ],
})
export class AuthModule {}
