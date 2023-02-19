import { Provider } from '@nestjs/common';
import { PAYMENT_CONSTANTS } from '../payment.constant';
import { PaypalPaymentServiceImplementation } from '../services/paypal-payment.service';

export const PaymentServiceProvider: Provider = {
  provide: PAYMENT_CONSTANTS.APPLICATION.SERVICE_TOKEN,
  useClass: PaypalPaymentServiceImplementation,
};
