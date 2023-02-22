import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_CONSTANTS } from 'src/cache/cache.constants';
import { CacheService } from 'src/cache/interfaces/cache-service.interface';
import { HttpMethod } from 'src/http/enums/http-method.enum';
import { HTTP_CONSTANTS } from 'src/http/http.constants';
import {HttpClient} from 'src/http/interfaces/http-client.interface';
import { PaypalEnvironments } from '../enums/paypal-environments.enum';
import { IncorrectPaypalAuthorizationResponseError } from '../errors/incorrect-paypal-authorization-response.error';
import { PaypalAccessTokenNotCachedError } from '../errors/paypal-access-token-not-cached.error';
import { PaypalAccessTokenNotFoundInCacheError } from '../errors/paypal-access-token-not-found-in-cache.error';
import { PaymentService } from '../interfaces/payment-service.interface';
import { PaypalAuthorizationResponse } from '../interfaces/paypal-authorization-response.interface';
import { SubscribeToPaymentPlan } from '../interfaces/subscribe-to-payment-plan.interface';
import { PAYMENT_CONSTANTS } from '../payment.constant';
import { PaymentPlanService } from './payment-plan.service';

@Injectable()
export class PaypalPaymentServiceImplementation
  implements PaymentService, OnModuleInit
{
  private readonly domain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentPlanService: PaymentPlanService,
    @Inject(CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cacheService: CacheService,
    @Inject(HTTP_CONSTANTS.APPLICATION.CLIENT_TOKEN)
    private readonly httpService: HttpClient,
  ) {
    const environment =
      this.configService.get<PaypalEnvironments>('PAYPAL_ENV');

    switch (environment) {
      case PaypalEnvironments.MAIN: {
        this.domain = 'https://api-m.paypal.com';

        break;
      }
      case PaypalEnvironments.SANDBOX: {
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

  public async subscribe(data: SubscribeToPaymentPlan): Promise<string> {
    return 'mock';
  }

  /**
   * Obtains and caches access token required for Bearer auth
   * Returns expiration time of the token in ms
   */
  private async getAndCacheAccessToken(): Promise<number> {
    const authorization = await this.authorizeWithException();

    const accessToken = await this.cacheService.set<string>(
      PAYMENT_CONSTANTS.APPLICATION.PAYPAL_ACCESS_TOKEN_CACHING_KEY,
      authorization.access_token,
      authorization.expires_in,
    );

    if (!accessToken) {
      throw new PaypalAccessTokenNotCachedError();
    }

    const expirationTimeInMs =
      (authorization.expires_in -
        PAYMENT_CONSTANTS.APPLICATION.PAYPAL_AUTH_REQUEST_DELAY_SECONDS) *
      1000;

    return expirationTimeInMs;
  }

  private async authorizeWithException(): Promise<PaypalAuthorizationResponse> {
    const url = this.getUrlWithDomain('/v1/oauth2/token');
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
      PAYMENT_CONSTANTS.APPLICATION.PAYPAL_ACCESS_TOKEN_CACHING_KEY,
    );

    if (!accessToken) {
      throw new PaypalAccessTokenNotFoundInCacheError();
    }

    const authorizationHeaders = `Bearer ${accessToken}`;

    return authorizationHeaders;
  }

  private getUrlWithDomain(path: string): string {
    const url = `${this.domain}${path}`;

    return url;
  }
}
