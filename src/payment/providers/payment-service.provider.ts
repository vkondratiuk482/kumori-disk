import { Provider } from '@nestjs/common';
import { PAYMENT_SERVICE_TOKEN } from '../constants/payment.constant';
import { PaypalPaymentServiceImplementation } from '../paypal-payment.service';

export const PaymentServiceProvider: Provider = {
  provide: PAYMENT_SERVICE_TOKEN,
  useClass: PaypalPaymentServiceImplementation,
};
