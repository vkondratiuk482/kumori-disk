import { Provider } from '@nestjs/common';
import { GITHUB_CONSTANTS } from '../github.constants';
import { HttpAPIGithubClient } from '../http-api-github.client';

export const GithubClientProvider: Provider = {
  provide: GITHUB_CONSTANTS.APPLICATION.CLIENT_TOKEN,
  useClass: HttpAPIGithubClient,
};
