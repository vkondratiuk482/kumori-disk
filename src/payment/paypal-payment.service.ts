import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_SERVICE_TOKEN } from 'src/cache/constants/cache.constants';
import { CacheService } from 'src/cache/interfaces/cache-service.interface';
import { HTTP_SERVICE_TOKEN } from 'src/http/constants/http.constants';
import { HttpMethod } from 'src/http/enums/http-method.enum';
import { HttpService } from 'src/http/interfaces/http-service.interface';
import {
  PAYPAL_ACCESS_TOKEN_CACHING_KEY,
  PAYPAL_AUTH_REQUEST_DELAY_SECONDS,
} from './constants/payment.constant';
import { PaypalEnvironment } from './enums/paypal-environment.enum';
import { IncorrectPaypalAuthorizationResponseError } from './errors/incorrect-paypal-authorization-response.error';
import { PaypalAccessTokenNotCachedError } from './errors/paypal-access-token-not-cached.error';
import { PaypalAccessTokenNotFoundInCacheError } from './errors/paypal-access-token-not-found-in-cache.error';
import { PaymentService } from './interfaces/payment-service.interface';
import { PaypalAuthorizationResponse } from './interfaces/paypal-authorization-response.interface';

@Injectable()
export class PaypalPaymentServiceImplementation
  implements PaymentService, OnModuleInit
{
  private readonly domain: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_SERVICE_TOKEN)
    private readonly cacheService: CacheService,
    @Inject(HTTP_SERVICE_TOKEN)
    private readonly httpService: HttpService,
  ) {
    const environment = this.configService.get<PaypalEnvironment>('PAYPAL_ENV');

    switch (environment) {
      case PaypalEnvironment.MAIN: {
        this.domain = 'https://api-m.paypal.com';

        break;
      }
      case PaypalEnvironment.SANDBOX: {
        this.domain = 'https://api-m.sandbox.paypal.com';

        break;
      }
      default: {
        throw new Error(
          'PAYPAL_ENV value in .env has to be one of the PaypalEnvironment enum values',
        );
      }
    }
  }

  public async onModuleInit(): Promise<void> {
    const expirationTimeInMs = await this.getAndCacheAccessToken();

    setTimeout(async () => {
      this.onModuleInit();
    }, expirationTimeInMs);
  }

  public async createOrder(): Promise<string> {
    return 'orderId';
  }

  /**
   * Obtains and caches access token required for Bearer auth
   * Returns expiration time of the token in ms
   */
  private async getAndCacheAccessToken(): Promise<number> {
    const authorization = await this.authorizeWithException();

    const accessToken = await this.cacheService.set<string>(
      PAYPAL_ACCESS_TOKEN_CACHING_KEY,
      authorization.access_token,
      authorization.expires_in,
    );

    if (!accessToken) {
      throw new PaypalAccessTokenNotCachedError();
    }

    const expirationTimeInMs =
      (authorization.expires_in - PAYPAL_AUTH_REQUEST_DELAY_SECONDS) * 1000;

    return expirationTimeInMs;
  }

  private async authorizeWithException(): Promise<PaypalAuthorizationResponse> {
    const url = `${this.domain}/v1/oauth2/token`;
    const body = `${encodeURIComponent('grant_type')}=${encodeURIComponent(
      'client_credentials',
    )}`;
    const authorizationHeaders = this.getBasicAuthorizationHeaders();
    const headers = {
      accept: 'application/json',
      'accept-language': 'en_US',
      'content-type': 'application/x-www-form-urlencoded',
      authorization: authorizationHeaders,
    };
    const method = HttpMethod.POST;

    const response =
      await this.httpService.request<PaypalAuthorizationResponse>({
        url,
        body,
        method,
        headers,
      });

    if (!response.access_token || !response.expires_in) {
      throw new IncorrectPaypalAuthorizationResponseError();
    }

    return response;
  }

  private getBasicAuthorizationHeaders(): string {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = Buffer.from(credentials).toString('base64');

    const authorizationHeaders = `Basic ${base64Credentials}`;

    return authorizationHeaders;
  }

  private async getBearerAuthorizationHeadersWithException(): Promise<string> {
    const accessToken = await this.cacheService.get<string>(
      PAYPAL_ACCESS_TOKEN_CACHING_KEY,
    );

    if (!accessToken) {
      throw new PaypalAccessTokenNotFoundInCacheError();
    }

    const authorizationHeaders = `Bearer ${accessToken}`;

    return authorizationHeaders;
  }
}
