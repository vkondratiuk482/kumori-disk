import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlsModule } from 'src/als/als.module';
import { EventModule } from 'src/event/event.module';
import { FileModule } from 'src/file/file.module';
import { GithubModule } from 'src/github/github.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { TypeOrmUserEntity } from './entities/typeorm-user.entity';
import { UserRepositoryProvider } from './providers/user-repository.provider';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntity]),
    AlsModule,
    JwtModule,
    FileModule,
    EventModule,
    GithubModule,
  ],
  providers: [UserService, UserRepositoryProvider, UserResolver],
  exports: [UserService],
})
export class UserModule {}
