import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import { AUTH_CONSTANTS } from './auth.constants';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { MAILER_SERVICE_TOKEN } from '../mailer/mailer.constants';
import { CACHE_SERVICE_TOKEN } from 'src/cache/constants/cache.constants';
import { CRYPTOGRAPHY_SERVICE_TOKEN } from 'src/cryptography/cryptography.constants';
import { UserConfirmationStatuses } from 'src/user/enums/user-confirmation-statuses.enum';

import { SignIn } from './interfaces/sign-in.interface';
import { JwtTypes } from 'src/jwt/enums/jwt-types.enum';
import { JwtPair } from 'src/jwt/interfaces/jwt-pair.interface';
import { SendMail } from '../mailer/interfaces/send-mail.interface';
import { JwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { JwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { CreateUser } from '../user/interfaces/create-user.interface';
import { CacheService } from 'src/cache/interfaces/cache-service.interface';
import { MailerService } from 'src/mailer/interfaces/mailer-service.interface';
import { CryptographyService } from 'src/cryptography/interfaces/cryptography-service.interface';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { EmailNotConfirmedError } from './errors/email-not-confirmed.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';
import { EmailAlreadyConfirmedError } from './errors/email-already-confirmed.error';
import { InvalidConfirmationHashError } from './errors/invalid-confirmation-hash.error';

import { UserEntity } from 'src/user/interfaces/user-entity.interface';
import { UserService } from '../user/user.service';
import {SignUp} from './interfaces/sign-up.interface';

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
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(payload: SignUp): Promise<UserEntity> {
    const mailAvailable = await this.userService.verifyMailAvailability(
      payload.email,
    );

    if (!mailAvailable) {
      throw new MailIsInUseError();
    }

    const hashedPassword = await this.cryptographyService.hash(
      payload.password,
    );

    const user = await this.userService.create({
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      confirmationStatus: UserConfirmationStatuses.Pending,
    });

    const confirmationHash = this.cryptographyService.randomUUID();
    const link = this.generateConfirmationLink(confirmationHash);

    await this.cacheService.set<string>(
      confirmationHash,
      user.id,
      AUTH_CONSTANTS.DOMAIN.CONFIRMATION_HASH_TTL_SECONDS,
    );
    await this.sendConfirmationMail(payload.email, link);

    return user;
  }

  public async singIn(payload: SignIn): Promise<JwtPair> {
    const user = await this.userService.findByEmailOrThrow(payload.email);

    if (user.confirmationStatus !== UserConfirmationStatuses.Confirmed) {
      throw new EmailNotConfirmedError();
    }

    const password = payload.password;
    const hashedPassword = user.password;
    const passwordsMatch = await this.cryptographyService.compareHashed(
      password,
      hashedPassword,
    );

    if (!passwordsMatch) {
      throw new PasswordsNotMatchingError();
    }

    const jwtPair = this.generateJwtPair({
      id: user.id,
    });

    return jwtPair;
  }

  public async confirmEmail(hash: string): Promise<boolean> {
    const id = await this.cacheService.get<string>(hash);

    if (!id) {
      throw new InvalidConfirmationHashError();
    }

    await this.cacheService.delete(hash);

    const user = await this.userService.findByIdOrThrow(id);

    const confirmedStatus = UserConfirmationStatuses.Confirmed;

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
    try {
      const user = await this.userService.findByEmailOrThrow(email);

      if (user.confirmationStatus === UserConfirmationStatuses.Confirmed) {
        throw new EmailAlreadyConfirmedError();
      }

      const hash = this.cryptographyService.randomUUID();
      const confirmationLink = this.generateConfirmationLink(hash);

      await this.cacheService.set<string>(
        hash,
        user.id,
        AUTH_CONSTANTS.DOMAIN.CONFIRMATION_HASH_TTL_SECONDS,
      );
      await this.sendConfirmationMail(email, confirmationLink);

      return true;
    } catch (err) {
      return false;
    }
  }

  private generateJwtPair(payload: JwtPayload): JwtPair {
    const accessToken = this.generateAccessJwt(payload);
    const refreshToken = this.generateRefreshJwt(payload);

    const pair: JwtPair = {
      accessToken,
      refreshToken,
    };

    return pair;
  }

  private generateAccessJwt(payload: JwtPayload): string {
    const accessToken = this.jwtService.generate(payload, JwtTypes.Access);

    return accessToken;
  }

  private generateRefreshJwt(payload: JwtPayload): string {
    const refreshToken = this.jwtService.generate(payload, JwtTypes.Refresh);

    return refreshToken;
  }

  private generateConfirmationLink(hash: string): string {
    const protocol = this.configService.get<string>('APP_PROTOCOL');
    const domain = this.configService.get<string>('APP_DOMAIN');

    const link = `${protocol}://${domain}?hash=${hash}`;

    return link;
  }

  private async sendConfirmationMail(
    receiver: string,
    link: string,
  ): Promise<void> {
    const subject = AUTH_CONSTANTS.DOMAIN.CONFIRMATION_MAIL_SUBJECT;
    const text = `${AUTH_CONSTANTS.DOMAIN.CONFIRMATION_MAIL_BASE_TEXT} - ${link}`;

    const data: SendMail = {
      text,
      subject,
      to: receiver,
    };

    return this.mailerService.sendEmail(data);
  }
}
