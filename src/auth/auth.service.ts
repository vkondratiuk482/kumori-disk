import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from './auth.constants';
import { MAILER_SERVICE_TOKEN } from '../mailer/mailer.constants';

import { SignIn } from './interfaces/sign-in.interface';
import { CreateUser } from '../user/interfaces/create-user.interface';
import { MailerServiceInterface } from '../mailer/interfaces/mailer-service.interface';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';

import { User } from '../user/user.entity';

import { UserService } from '../user/user.service';
import { SendMail } from 'src/mailer/interfaces/send-mail.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(MAILER_SERVICE_TOKEN)
    private readonly mailerService: MailerServiceInterface,
  ) {}

  public async signUp(data: CreateUser): Promise<User> {
    const isMailedUsed = await this.userService.isMailUsed(data.email);

    if (isMailedUsed) {
      throw new MailIsInUseError();
    }

    const hashedPassword = await this.encryptString(data.password);

    const createSingleUserData: CreateUser = {
      email: data.email,
      username: data.username,
      password: hashedPassword,
    };
    const user = await this.userService.createSingleForSignUp(
      createSingleUserData,
    );

    await this.sendSignUpConfirmationMail(data.email);

    return user;
  }

  public async singIn(data: SignIn): Promise<User> {
    const user = await this.userService.findSingleByEmailWithException(
      data.email,
    );

    const password = data.password;
    const encryptedPassword = user.password;
    const arePasswordsMatching = await this.compareEncrypted(
      password,
      encryptedPassword,
    );

    if (!arePasswordsMatching) {
      throw new PasswordsNotMatchingError();
    }

    return user;
  }

  private async sendSignUpConfirmationMail(receiver: string): Promise<void> {
    const data: SendMail = {
      to: receiver,
      subject: 'Confirm signing up',
      text: 'Helllo',
    };

    await this.mailerService.sendEmail(data);
  }

  private async encryptString(data: string): Promise<string> {
    const value = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);

    return value;
  }

  private async compareEncrypted(
    data: string,
    encrypted: string,
  ): Promise<boolean> {
    const passwordsMatch = await bcrypt.compare(data, encrypted);

    return passwordsMatch;
  }
}
