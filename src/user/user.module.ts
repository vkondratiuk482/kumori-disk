import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from 'src/event/event.module';
import { FileModule } from 'src/file/file.module';
import { TypeOrmUserEntityImplementation } from './entities/typeorm-user.entity';

import { UserRepositoryProvider } from './providers/user-repository.provider';

import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntityImplementation]),
    FileModule,
    EventModule,
  ],
  providers: [UserService, UserRepositoryProvider],
  exports: [UserService],
})
export class UserModule {}
