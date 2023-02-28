import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { HTTP_CONSTANTS } from 'src/http/http.constants';
import { HttpMethod } from 'src/http/enums/http-method.enum';
import { GithubUser } from './interfaces/github-user.interface';
import { GithubClient } from './interfaces/github-client.interface';
import { HttpClient } from 'src/http/interfaces/http-client.interface';
import { HttpTransformerService } from 'src/http/interfaces/http-transformer-service.interface';
import { GithubObtainAccessTokenResponse } from './interfaces/github-obtain-access-token-response.interface';

@Injectable()
export class HttpAPIGithubClientImpl implements GithubClient {
  private readonly oauthURL: string;
  private readonly clientId: string;
  private readonly apiBaseURL: string;
  private readonly authBaseURL: string;
  private readonly redirectURI: string;
  private readonly clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(HTTP_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly httpClient: HttpClient,
    @Inject(HTTP_CONSTANTS.APPLICATION.TRANSFORMER_SERVICE_TOKEN)
    private readonly httpTransformerService: HttpTransformerService,
  ) {
    this.redirectURI = this.configService.get<string>(
      'GITHUB_OAUTH_REDIRECT_URI',
    );
    this.clientSecret = this.configService.get<string>(
      'GITHUB_OAUTH_CLIENT_SECRET',
    );
    this.apiBaseURL = this.configService.get<string>('GITHUB_API_BASE_URL');
    this.clientId = this.configService.get<string>('GITHUB_OAUTH_CLIENT_ID');
    this.authBaseURL = this.configService.get<string>('GITHUB_AUTH_BASE_URL');

    const oauthUSP = new URLSearchParams();
    oauthUSP.set('client_id', this.clientId);
    oauthUSP.set('redirect_uri', this.redirectURI);
    oauthUSP.set('scope', ['read:user', 'user:email'].join(' '));

    this.oauthURL = `${
      this.authBaseURL
    }/login/oauth/authorize?${oauthUSP.toString()}`;
  }

  public obtainOAuthAuthorizeURL(): string {
    return this.oauthURL;
  }

  public async obtainAccessToken(code: string): Promise<string> {
    const response =
      await this.httpClient.request<GithubObtainAccessTokenResponse>({
        method: HttpMethod.POST,
        headers: {
          Accept: 'application/json',
        },
        body: {
          code,
          client_id: this.clientId,
          redirect_uri: this.redirectURI,
          client_secret: this.clientSecret,
        },
        url: `${this.authBaseURL}/login/oauth/access_token`,
      });

    return response.access_token;
  }

  public async obtainUser(accessToken: string): Promise<GithubUser> {
    const response = await this.httpClient.request<GithubUser>({
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      url: `${this.apiBaseURL}/user`,
    });

    return response;
  }
}
