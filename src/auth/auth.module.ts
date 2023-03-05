import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/jwt/jwt.module';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { CacheModule } from 'src/cache/cache.module';
import { AuthService } from './services/auth.service';
import { MailerModule } from '../mailer/mailer.module';
import { GithubModule } from 'src/github/github.module';
import { GithubAuthService } from './services/github-auth.service';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { TypeormAuthProviderEntityImpl } from './entities/typeorm-auth-provider.entity';
import { TypeormUsersAuthProvidersEntityImpl } from './entities/typeorm-users-auth-providers.entity';
import { UsersAuthProvidersRepositoryProvider } from './providers/users-auth-providers-repository.provider';
import { AuthProviderRepositoryProvider } from './providers/auth-provider-repository.provider';
import { AlsModule } from 'src/als/als.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeormAuthProviderEntityImpl,
      TypeormUsersAuthProvidersEntityImpl,
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
    AuthService,
    AuthResolver,
    GithubAuthService,
    AuthProviderRepositoryProvider,
    UsersAuthProvidersRepositoryProvider,
  ],
})
export class AuthModule {}
