import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import {
  BCRYPT_SALT_ROUNDS,
  CONFIRMATION_HASH_TTL_SECONDS,
} from './auth.constants';
import { MAILER_SERVICE_TOKEN } from '../mailer/mailer.constants';
import { REDIS_SERVICE_TOKEN } from '../redis/constants/redis.constants';

import { UserConfirmationStatus } from '../user/enums/user-confirmation-status.enum';

import { SignIn } from './interfaces/sign-in.interface';
import { SendMail } from '../mailer/interfaces/send-mail.interface';
import { CreateUser } from '../user/interfaces/create-user.interface';
import { RedisServiceInterface } from '../redis/interfaces/redis-service.interface';
import { MailerServiceInterface } from '../mailer/interfaces/mailer-service.interface';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { EmailNotConfirmedError } from './errors/email-not-confirmed.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';
import { EmailAlreadyConfirmedError } from './errors/email-already-confirmed.error';
import { InvalidConfirmationHashError } from './errors/invalid-confirmation-hash.error';

import { User } from '../user/user.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(MAILER_SERVICE_TOKEN)
    private readonly mailerService: MailerServiceInterface,
    @Inject(REDIS_SERVICE_TOKEN)
    private readonly redisService: RedisServiceInterface,
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

    const hash = this.generateHash();
    const confirmationLink = this.generateConfirmationLink(hash);

    await this.redisService.set(hash, user.uuid, CONFIRMATION_HASH_TTL_SECONDS);
    await this.sendSignUpConfirmationMail(data.email, confirmationLink);

    return user;
  }

  public async singIn(data: SignIn): Promise<User> {
    const user = await this.userService.findSingleByEmailWithException(
      data.email,
    );

    if (user.confirmationStatus !== UserConfirmationStatus.Confirmed) {
      throw new EmailNotConfirmedError();
    }

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

  public async confirmEmail(hash: string): Promise<boolean> {
    const uuid = await this.redisService.get<string>(hash);

    if (!uuid) {
      throw new InvalidConfirmationHashError();
    }

    await this.redisService.delete(hash);

    const user = await this.userService.findSingleByUuidWithException(uuid);

    const confirmedStatus = UserConfirmationStatus.Confirmed;

    if (user.confirmationStatus === confirmedStatus) {
      throw new EmailAlreadyConfirmedError();
    }

    const isConfirmed = await this.userService.updateConfirmationStatus(
      uuid,
      confirmedStatus,
    );

    return isConfirmed;
  }

  public async resendConfirmationEmail(email: string): Promise<boolean> {
    const user = await this.userService.findSingleByEmailWithException(email);

    if (user.confirmationStatus === UserConfirmationStatus.Confirmed) {
      throw new EmailAlreadyConfirmedError();
    }

    const hash = this.generateHash();
    const confirmationLink = this.generateConfirmationLink(hash);

    await this.redisService.set(hash, user.uuid, CONFIRMATION_HASH_TTL_SECONDS);
    await this.sendSignUpConfirmationMail(email, confirmationLink);

    return true;
  }

  private generateHash(): string {
    const hash = randomUUID();

    return hash;
  }

  private generateConfirmationLink(hash: string): string {
    const protocol = this.configService.get<string>('APP_PROTOCOL');
    const domain = this.configService.get<string>('APP_DOMAIN');

    const link = `${protocol}://${domain}?hash=${hash}`;

    return link;
  }

  private async sendSignUpConfirmationMail(
    receiver: string,
    link: string,
  ): Promise<void> {
    const text = `You've signed up for Kumori-Disk cloud storage, please follow the link to verify your email address - ${link}`;
    const subject = 'Account verification for Kumori-Disk';

    const data: SendMail = {
      to: receiver,
      subject,
      text,
    };

    return this.mailerService.sendEmail(data);
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
