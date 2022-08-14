import { BadRequestException, Session } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Session as FastifySession } from '@fastify/secure-session';

import { SignUpSchema } from './schema/sign-up.schema';

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
    const user = await this.authService.signUp(schema);

    if (!user) {
      throw new BadRequestException(
        'An error occurred while creating the user',
      );
    }

    session.set('user_uuid', user.uuid);

    return user;
  }
}
