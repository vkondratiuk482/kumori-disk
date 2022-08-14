import { BadRequestException, Session } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Session as FastifySession } from '@fastify/secure-session';

import { SignUpSchema } from './schema/sign-up.schema';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { name: 'signUp' })
  public async signUp(
    @Args() schema: SignUpSchema,
    @Session() session: FastifySession,
  ): Promise<string> {
    const uuid = await this.authService.signUp(schema);

    if (!uuid) {
      throw new BadRequestException(
        'An error occurred while creating the user',
      );
    }

    session.set('uuid', uuid);

		return uuid;
  }
}
