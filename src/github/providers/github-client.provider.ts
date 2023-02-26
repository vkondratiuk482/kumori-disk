import { Provider } from '@nestjs/common';
import { GITHUB_CONSTANTS } from '../github.constants';
import { HttpAPIGithubClientImpl } from '../http-api-github.client';

export const GithubClientProvider: Provider = {
  provide: GITHUB_CONSTANTS.APPLICATION.CLIENT_TOKEN,
  useClass: HttpAPIGithubClientImpl,
};
