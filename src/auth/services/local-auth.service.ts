import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { AuthError } from '../errors/auth.error';
import { AUTH_CONSTANTS } from '../auth.constants';
import { UserService } from '../../user/user.service';
import { JWT_CONSTANTS } from 'src/jwt/jwt.constants';
import { USER_CONSTANTS } from 'src/user/user.constants';
import { CACHE_CONSTANTS } from 'src/cache/cache.constants';
import { MAILER_CONSTANTS } from 'src/mailer/mailer.constants';
import { ILocalSignUp } from '../interfaces/sign-up.interface';
import { ILocalSignIn } from '../interfaces/sign-in.interface';
import { IJwtPair } from 'src/jwt/interfaces/jwt-pair.interface';
import { IJwtPayload } from 'src/jwt/interfaces/jwt-payload.interface';
import { IJwtService } from 'src/jwt/interfaces/jwt-service.interface';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';
import { ICacheService } from 'src/cache/interfaces/cache-service.interface';
import { IMailerService } from 'src/mailer/interfaces/mailer-service.interface';
import { CRYPTOGRAPHY_CONSTANTS } from 'src/cryptography/cryptography.constants';
import { UserConfirmationStatuses } from 'src/user/enums/user-confirmation-statuses.enum';
import { ICryptographyService } from 'src/cryptography/interfaces/cryptography-service.interface';

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(MAILER_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly mailerService: IMailerService,
    @Inject(CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cacheService: ICacheService,
    @Inject(CRYPTOGRAPHY_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cryptographyService: ICryptographyService,
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: IJwtService,
  ) {}

  public async signUp(payload: ILocalSignUp): Promise<IUserEntity> {
    const emailExists = await this.userService.existsByEmail(payload.email);

    if (emailExists) {
      throw AuthError.MailIsInUse();
    }

    const hashedPassword = await this.cryptographyService.hash(
      payload.password,
    );

    const user = await this.userService.create({
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      confirmationStatus: UserConfirmationStatuses.Pending,
      diskSpace: USER_CONSTANTS.DOMAIN.DEFAULT_PLAN_AVAILABLE_SIZE_IN_BYTES,
    });

    const confirmationHash = this.cryptographyService.randomUUID();
    const link = this.generateConfirmationLink(confirmationHash);

    await this.cacheService.set<string>(
      confirmationHash,
      user.id,
      AUTH_CONSTANTS.DOMAIN.CONFIRMATION_HASH_TTL_SECONDS,
    );
    await this.mailerService.sendConfirmation({
      link,
      receiver: payload.email,
    });

    return user;
  }

  public async singIn(payload: ILocalSignIn): Promise<IJwtPair> {
    const user = await this.userService.findByEmailOrThrow(payload.email);

    if (user.confirmationStatus !== UserConfirmationStatuses.Confirmed) {
      throw AuthError.EmailNotConfirmed();
    }

    const password = payload.password;
    const hashedPassword = user.password;
    const passwordsMatch = await this.cryptographyService.compareHashed(
      password,
      hashedPassword,
    );

    if (!passwordsMatch) {
      throw AuthError.PasswordsNotMatching();
    }

    const jwtPayload: IJwtPayload = {
      id: user.id,
    };
    const jwtPair = this.jwtService.generatePair(jwtPayload);

    return jwtPair;
  }

  public async confirmEmail(hash: string): Promise<boolean> {
    const id = await this.cacheService.get<string>(hash);

    if (!id) {
      throw AuthError.InvalidConfirmationHash();
    }

    await this.cacheService.delete(hash);

    const user = await this.userService.findByIdOrThrow(id);

    const confirmedStatus = UserConfirmationStatuses.Confirmed;

    if (user.confirmationStatus === confirmedStatus) {
      throw AuthError.EmailAlreadyConfirmed();
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
        throw AuthError.EmailAlreadyConfirmed();
      }

      const hash = this.cryptographyService.randomUUID();
      const confirmationLink = this.generateConfirmationLink(hash);

      await this.cacheService.set<string>(
        hash,
        user.id,
        AUTH_CONSTANTS.DOMAIN.CONFIRMATION_HASH_TTL_SECONDS,
      );
      await this.mailerService.sendConfirmation({
        receiver: email,
        link: confirmationLink,
      });

      return true;
    } catch (err) {
      return false;
    }
  }

  private generateConfirmationLink(hash: string): string {
    const domain = this.configService.get<string>('APP_DOMAIN');
    const protocol = this.configService.get<string>('APP_PROTOCOL');

    const link = `${protocol}://${domain}?hash=${hash}`;

    return link;
  }
}
