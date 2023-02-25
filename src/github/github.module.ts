import { Module } from '@nestjs/common';
import {HttpModule} from 'src/http/http.module';
import { GithubClient } from './github.client';

@Module({
  imports: [HttpModule],
  providers: [GithubClient],
  exports: [GithubClient],
})
export class GithubModule {}
