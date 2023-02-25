import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpMethod } from 'src/http/enums/http-method.enum';
import { HTTP_CONSTANTS } from 'src/http/http.constants';
import { HttpClient } from 'src/http/interfaces/http-client.interface';

@Injectable()
export class GithubClient {
  private readonly domain: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(HTTP_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly httpClient: HttpClient,
  ) {
    this.domain = 'https://github.com';
  }

  public async oauthAuthorize(): Promise<void> {
    await this.httpClient.request<void>({
      url: this.domain,
      method: HttpMethod.GET,
      query: {
        scope: ['read:user', 'user:email'].join(' '),
        client_id: this.configService.get<string>('GITHUB_OAUTH_CLIENT_ID'),
        redirect_uri: this.configService.get<string>(
          'GITHUB_OAUTH_CLIENT_SECRET',
        ),
      },
    });
  }
}
