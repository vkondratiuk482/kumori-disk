import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [UserModule, MailerModule],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
