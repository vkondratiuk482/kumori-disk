import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int, Context } from '@nestjs/graphql';

import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { EmailNotConfirmedError } from './errors/email-not-confirmed.error';
import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';
import { EmailAlreadyConfirmedError } from './errors/email-already-confirmed.error';
import { UserNotFoundByUuidError } from 'src/user/errors/user-not-found-by-uuid.error';
import { InvalidConfirmationHashError } from './errors/invalid-confirmation-hash.error';
import { UserNotFoundByEmailError } from '../user/errors/user-not-found-by-email.error';

import { GraphQLContext } from 'src/graphql/interfaces/graphql-context.interface';

import { SignUpSchema } from './schema/sign-up.schema';
import { SignInSchema } from './schema/sign-in.schema';

import { User } from '../user/user.entity';

import { SessionAuthGuard } from './guards/session-auth.guard';

import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Int, { name: 'test' })
  public async test(@Args('id') id: number): Promise<number> {
    return 1;
  }

  @Mutation(() => User, { name: 'signUp' })
  public async signUp(@Args('schema') schema: SignUpSchema): Promise<User> {
    try {
      const user = await this.authService.signUp(schema);

      return user;
    } catch (err) {
      if (err instanceof MailIsInUseError) {
        throw new ConflictException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @Mutation(() => User, { name: 'signIn' })
  public async signIn(
    @Args('schema') schema: SignInSchema,
    @Context() context: GraphQLContext,
  ): Promise<User> {
    try {
      const user = await this.authService.singIn(schema);

      context.req.session.set('user_uuid', user.uuid);

      return user;
    } catch (err) {
      if (err instanceof PasswordsNotMatchingError) {
        throw new UnauthorizedException(err);
      }
      if (err instanceof UserNotFoundByEmailError) {
        throw new NotFoundException(err);
      }
      if (err instanceof EmailNotConfirmedError) {
        throw new ForbiddenException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean, { name: 'signOut' })
  public async signOut(@Context() context: GraphQLContext): Promise<boolean> {
    try {
      context.req.session.delete();

      const sessionDeleted = context.req.session.deleted;

      return sessionDeleted;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Mutation(() => Boolean, { name: 'confirmEmail' })
  public async confirmEmail(@Args('hash') hash: string): Promise<boolean> {
    try {
      const confirmed = await this.authService.confirmEmail(hash);

      return confirmed;
    } catch (err) {
      if (
        err instanceof InvalidConfirmationHashError ||
        err instanceof EmailAlreadyConfirmedError
      ) {
        throw new ConflictException(err);
      }
      if (err instanceof UserNotFoundByUuidError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @Mutation(() => Boolean, { name: 'resendConfirmationEmail' })
  public async resendConfirmationEmail(
    @Args('email') email: string,
  ): Promise<boolean> {
    try {
      const resent = await this.authService.resendConfirmationEmail(email);

      return resent;
    } catch (err) {
      if (err instanceof EmailAlreadyConfirmedError) {
        throw new ConflictException(err);
      }
      if (err instanceof UserNotFoundByEmailError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException(err);
    }
  }
}
