import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { SessionAuthGuard } from 'src/user/guards/session-auth.guard';
import { FileNotAccessibleError } from 'src/file/errors/file-not-accessible.error';
import { FileNotCreatedInDatabaseError } from 'src/file/errors/file-not-created-in-database.error';
import { FileNotUploadedToStorageError } from 'src/file/errors/file-not-uploaded-to-storage.error';
import { convertGraphQLFileToFile } from 'src/file/file.utils';
import { UploadFileSchema } from 'src/file/schema/upload-file.schema';
import { GraphQLContext } from 'src/graphql/interfaces/graphql-context.interface';
import { User } from './entities/user.entity';
import { UserNotFoundByIdError } from './errors/user-not-found-by-uuid.error';
import { UserService } from './user.service';
import { UserShareAccessSchema } from './schema/user-share-access.schema';
import { UserRevokeAccessSchema } from './schema/user-revoke-access.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SessionAuthGuard)
  @Mutation(() => String, { name: 'uploadSingleFile' })
  public async uploadSingleFile(
    @Args('schema') schema: UploadFileSchema,
    @Context() context: GraphQLContext,
  ) {
    try {
      const userId: string = context.req.session.get('user_id');
      const file = await convertGraphQLFileToFile(schema);

      const key = await this.userService.uploadSingleFileWithException(
        userId,
        file,
      );

      return key;
    } catch (err) {
      if (
        err instanceof FileNotUploadedToStorageError ||
        FileNotCreatedInDatabaseError
      ) {
        throw new ConflictException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean, { name: 'userShareAccess' })
  public async shareAccess(
    @Args('schema') schema: UserShareAccessSchema,
    @Context() context: GraphQLContext,
  ) {
    try {
      const ownerId: string = context.req.session.get('user_id');

      const shared = await this.userService.shareAccessWithException(
        ownerId,
        schema,
      );

      return shared;
    } catch (err) {
      if (err instanceof FileNotAccessibleError) {
        throw new ForbiddenException(err);
      }
      if (err instanceof UserNotFoundByIdError) {
        throw new NotFoundException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean, { name: 'userRevokeAccess' })
  public async revokeAccess(
    @Args('schema') schema: UserRevokeAccessSchema,
    @Context() context: GraphQLContext,
  ) {
    try {
      const ownerId: string = context.req.session.get('user_id');

      const revoked = await this.userService.revokeAccessWithException(
        ownerId,
        schema,
      );

      return revoked;
    } catch (err) {
      if (err instanceof FileNotAccessibleError) {
        throw new ForbiddenException(err);
      }

      throw new BadRequestException(err);
    }
  }
}
