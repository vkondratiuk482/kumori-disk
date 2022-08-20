import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int, Context } from '@nestjs/graphql';

import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';

import { GraphQLContext } from 'src/graphql/interfaces/graphql-context.interface';

import { SignUpSchema } from './schema/sign-up.schema';
import { SignInSchema } from './schema/sign-in.schema';

import { User } from '../user/user.entity';

import { SessionAuthGuard } from './guards/session-auth.guard';

import { AuthService } from './auth.service';
import { MailIsInUseError } from './errors/mail-is-in-use.error';
import { UserNotFoundByEmailError } from 'src/user/errors/user-not-found-by-email.error';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Int, { name: 'testr2' })
  public async testqueryr2(@Args('id') args: number): Promise<number> {
    return 1;
  }

  @Mutation(() => User, { name: 'signUp' })
  public async signUp(
    @Args('schema') schema: SignUpSchema,
    @Context() context: GraphQLContext,
  ): Promise<User> {
    try {
      const user = await this.authService.signUp(schema);

      context.req.session.set('user_uuid', user.uuid);

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

      throw new BadRequestException(err);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean, { name: 'signOut' })
  public async signOut(@Context() context: GraphQLContext): Promise<boolean> {
    try {
      context.req.session.delete();

      const isSessionDeleted = context.req.session.deleted;

      return isSessionDeleted;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
