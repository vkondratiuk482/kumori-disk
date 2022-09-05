import { Module } from '@nestjs/common';

import { UserRepositoryProvider } from './providers/user-repository.provider';

import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepositoryProvider],
  exports: [UserService],
})
export class UserModule {}
