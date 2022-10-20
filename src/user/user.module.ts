import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/file/file.module';
import { User } from './entities/user.entity';

import { UserRepositoryProvider } from './providers/user-repository.provider';

import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FileModule],
  providers: [UserService, UserRepositoryProvider],
  exports: [UserService],
})
export class UserModule {}
