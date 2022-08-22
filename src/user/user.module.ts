import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepositoryProvider } from './providers/user-repository.provider';

import { User } from './user.entity';

import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepositoryProvider],
  exports: [UserService],
})
export class UserModule {}
