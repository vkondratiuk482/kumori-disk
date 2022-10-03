import {
  BadRequestException,
  ConflictException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { FILE_SERVICE_TOKEN } from './constants/file.constants';
import { FileServiceInterface } from './interfaces/file-service.interface';
import { File } from './entities/file.entity';
import { FileNotUploadedError } from './errors/file-not-uploaded.error';
import { GraphQLContext } from 'src/graphql/interfaces/graphql-context.interface';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { UploadFileSchema } from './schema/upload-file.schema';

@Resolver(() => File)
export class FileResolver {
  constructor(
    @Inject(FILE_SERVICE_TOKEN)
    private readonly fileService: FileServiceInterface,
  ) {}

  /**
   * Probably move it to UserResolver
   */

  @UseGuards(SessionAuthGuard)
  @Mutation(() => String, { name: 'uploadFile' })
  public async uploadFile(
    @Args('schema') schema: UploadFileSchema,
    @Context() context: GraphQLContext,
  ): Promise<string> {
    try {
      const userUuid: string = context.req.session.get('user_uuid');

      const file = await this.fileService.uploadWithException(userUuid, schema);

      return file;
    } catch (err) {
      if (err instanceof FileNotUploadedError) {
        throw new ConflictException(err);
      }

      throw new BadRequestException(err);
    }
  }
}
