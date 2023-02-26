import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { HTTP_CONSTANTS } from 'src/http/http.constants';
import { GithubClient } from './interfaces/github-client.interface';
import { HttpClient } from 'src/http/interfaces/http-client.interface';
import { HttpTransformerService } from 'src/http/interfaces/http-transformer-service.interface';

@Injectable()
export class HttpAPIGithubClientImpl implements GithubClient {
  private readonly baseURL: string;
  private readonly oauthURL: string;
  private readonly clientId: string;
  private readonly redirectURI: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(HTTP_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly httpClient: HttpClient,
    @Inject(HTTP_CONSTANTS.APPLICATION.TRANSFORMER_SERVICE_TOKEN)
    private readonly httpTransformerService: HttpTransformerService,
  ) {
    this.redirectURI = this.configService.get<string>(
      'GITHUB_OAUTH_CLIENT_SECRET',
    );
    this.baseURL = this.configService.get<string>('GITHUB_BASE_URL');
    this.clientId = this.configService.get<string>('GITHUB_OAUTH_CLIENT_ID');

    const oauthQueryParams = this.httpTransformerService.query({
      client_id: this.clientId,
      redirect_uri: this.redirectURI,
      scope: ['read:user', 'user:email'].join(' '),
    });
    this.oauthURL = `${this.baseURL}/login/oauth/authorize?${oauthQueryParams}`;
  }

  public obtainOAuthAuthorizeURL(): string {
    return this.oauthURL;
  }
}
