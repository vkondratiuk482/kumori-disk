import { Module } from '@nestjs/common';
import { HttpModule } from 'src/http/http.module';
import { GithubClientProvider } from './providers/github-client.provider';

@Module({
  imports: [HttpModule],
  providers: [GithubClientProvider],
  exports: [GithubClientProvider],
})
export class GithubModule {}
