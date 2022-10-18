import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { FILE_SERVICE_TOKEN } from './constants/file.constants';
import { File } from './entities/file.entity';
import { GraphQLContext } from 'src/graphql/interfaces/graphql-context.interface';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { UploadFileSchema } from './schema/upload-file.schema';
import { FileService } from './interfaces/file-service.interface';
import { FileNotUploadedToS3Error } from './errors/file-not-uploaded-to-s3.error';
import { FileNotCreatedInDatabaseError } from './errors/file-not-created-in-database.error';
import { ShareAccessSchema } from './schema/share-access.schema';
import { FileNotAccessibleError } from './errors/file-not-accessible.error';
import { UserNotFoundByIdError } from 'src/user/errors/user-not-found-by-uuid.error';

@Resolver(() => File)
export class FileResolver {
  constructor(
    @Inject(FILE_SERVICE_TOKEN)
    private readonly fileService: FileService,
  ) {}

  @UseGuards(SessionAuthGuard)
  @Mutation(() => String, { name: 'uploadFile' })
  public async uploadFile(
    @Args('schema') schema: UploadFileSchema,
    @Context() context: GraphQLContext,
  ): Promise<string> {
    try {
      const userId: string = context.req.session.get('user_id');

      const file = await this.fileService.uploadGraphQLWithException(
        userId,
        schema,
      );

      return file;
    } catch (err) {
      if (
        err instanceof FileNotUploadedToS3Error ||
        FileNotCreatedInDatabaseError
      ) {
        throw new ConflictException(err);
      }

      throw new BadRequestException(err);
    }
  }

  @UseGuards(SessionAuthGuard)
  @Mutation(() => Boolean, { name: 'shareAccess' })
  public async shareAccess(
    @Args('schema') schema: ShareAccessSchema,
    @Context() context: GraphQLContext,
  ): Promise<boolean> {
    try {
      const ownerId: string = context.req.session.get('user_id');

      const shared = await this.fileService.shareAccessWithException(
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
}
