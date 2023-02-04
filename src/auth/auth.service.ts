import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import crypto from 'node:crypto';

import { CONFIRMATION_HASH_TTL_SECONDS } from './auth.constants';
import { MAILER_SERVICE_TOKEN } from '../mailer/mailer.constants';
import { CACHE_SERVICE_TOKEN } from 'src/cache/constants/cache.constants';
import { CRYPTOGRAPHY_SERVICE_TOKEN } from 'src/cryptography/cryptography.constants';

import { UserConfirmationStatus } from '../user/enums/user-confirmation-status.enum';

import { SignIn } from './interfaces/sign-in.interface';
import { SendMail } from '../mailer/interfaces/send-mail.interface';
import { CreateUser } from '../user/interfaces/create-user.interface';
import { MailerService } from 'src/mailer/interfaces/mailer-service.interface';
import { CryptographyService } from 'src/cryptography/interfaces/cryptography-service.interface';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { EmailNotConfirmedError } from './errors/email-not-confirmed.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';
import { EmailAlreadyConfirmedError } from './errors/email-already-confirmed.error';
import { InvalidConfirmationHashError } from './errors/invalid-confirmation-hash.error';

import { UserService } from '../user/user.service';
import { UserEntity } from 'src/user/interfaces/user-entity.interface';
import { CacheService } from 'src/cache/interfaces/cache-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(MAILER_SERVICE_TOKEN)
    private readonly mailerService: MailerService,
    @Inject(CACHE_SERVICE_TOKEN)
    private readonly cacheService: CacheService,
    @Inject(CRYPTOGRAPHY_SERVICE_TOKEN)
    private readonly cryptographyService: CryptographyService,
  ) {}

  public async signUp(payload: CreateUser): Promise<UserEntity> {
    const mailUsed = await this.userService.mailUsed(payload.email);

    if (mailUsed) {
      throw new MailIsInUseError();
    }

    const hashedPassword = await this.cryptographyService.hash(
      payload.password,
    );

    const data: CreateUser = {
      email: payload.email,
      username: payload.username,
      password: hashedPassword,
    };
    const user = await this.userService.createSingleForSignUp(data);

    const hash = this.cryptographyService.randomUUID();
    const confirmationLink = this.generateConfirmationLink(hash);

    await this.cacheService.set<string>(
      hash,
      user.id,
      CONFIRMATION_HASH_TTL_SECONDS,
    );
    await this.sendSignUpConfirmationMail(payload.email, confirmationLink);

    return user;
  }

  public async singIn(payload: SignIn): Promise<UserEntity> {
    const user = await this.userService.findSingleByEmailWithException(
      payload.email,
    );

    if (user.confirmationStatus !== UserConfirmationStatus.Confirmed) {
      throw new EmailNotConfirmedError();
    }

    const password = payload.password;
    const encryptedPassword = user.password;
    const passwordsMatch = await this.cryptographyService.compareHashed(
      password,
      encryptedPassword,
    );

    if (!passwordsMatch) {
      throw new PasswordsNotMatchingError();
    }

    return user;
  }

  public async confirmEmail(hash: string): Promise<boolean> {
    const id = await this.cacheService.get<string>(hash);

    if (!id) {
      throw new InvalidConfirmationHashError();
    }

    await this.cacheService.delete(hash);

    const user = await this.userService.findSingleByIdWithException(id);

    const confirmedStatus = UserConfirmationStatus.Confirmed;

    if (user.confirmationStatus === confirmedStatus) {
      throw new EmailAlreadyConfirmedError();
    }

    const confirmed = await this.userService.updateConfirmationStatus(
      id,
      confirmedStatus,
    );

    return confirmed;
  }

  public async resendConfirmationEmail(email: string): Promise<boolean> {
    const user = await this.userService.findSingleByEmailWithException(email);

    if (user.confirmationStatus === UserConfirmationStatus.Confirmed) {
      throw new EmailAlreadyConfirmedError();
    }

    const hash = this.cryptographyService.randomUUID();
    const confirmationLink = this.generateConfirmationLink(hash);

    await this.cacheService.set<string>(
      hash,
      user.id,
      CONFIRMATION_HASH_TTL_SECONDS,
    );
    await this.sendSignUpConfirmationMail(email, confirmationLink);

    return true;
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
}
