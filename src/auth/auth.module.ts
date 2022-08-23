import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MailerModule } from '../mailer/mailer.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, UserModule, MailerModule, RedisModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
