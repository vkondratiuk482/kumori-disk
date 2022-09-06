import { Module } from '@nestjs/common';

import { UserDynamoStore } from './providers/user.dynamo-store';
import { UserRepositoryProvider } from './providers/user-repository.provider';

import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepositoryProvider, UserDynamoStore],
  exports: [UserService],
})
export class UserModule {}
