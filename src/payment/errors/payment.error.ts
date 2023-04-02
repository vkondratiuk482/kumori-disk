import { DomainError } from 'src/common/domain-error';

export class PaymentError extends DomainError {
  constructor(message?: string) {
    super(message);
  }

  public static IncorrectPaypalAuthorizationResponse(): PaymentError {
    return new PaymentError('Received incorrect Paypal authorization response');
  }

  public static PaymentPlanNotFound(): PaymentError {
    return new PaymentError(
      'There is no payment plan under specified search criteria',
    );
  }

  public static PaypalAccessTokenNotCached(): PaymentError {
    return new PaymentError('Paypal access token has not been cached');
  }

  public static PaypalAccessTokenNotFoundInCache(): PaymentError {
    return new PaymentError('Paypal access token has not found in cache');
  }
}
