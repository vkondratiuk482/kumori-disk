import {
  BadRequestException,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Session as FastifySession } from '@fastify/secure-session';

import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';

import { SignUpSchema } from './schema/sign-up.schema';
import { SignInSchema } from './schema/sign-in.schema';

import { User } from 'src/user/user.entity';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'signUp' })
  public async signUp(
    @Args() schema: SignUpSchema,
    @Session() session: FastifySession,
  ): Promise<User> {
    try {
      const user = await this.authService.signUp(schema);

      session.set('user_uuid', user.uuid);

      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Mutation(() => User, { name: 'signIn' })
  public async signIn(
    @Args() schema: SignInSchema,
    @Session() session: FastifySession,
  ): Promise<User> {
    try {
      const user = await this.authService.singIn(schema);

      session.set('user_uuid', user.uuid);

      return user;
    } catch (err) {
      if (err.name === PasswordsNotMatchingError.name) {
        throw new UnauthorizedException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @Mutation(() => Boolean, { name: 'signOut' })
  public async signOut(@Session() session: FastifySession): Promise<boolean> {
    try {
      session.delete();

      const isSessionDeleted = session.deleted;

      return isSessionDeleted;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
