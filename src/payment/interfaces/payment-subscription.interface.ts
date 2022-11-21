import { PaymentCurrencies } from '../enums/payment-currencies.enum';

export interface PaymentSubscription {
  readonly monthlyFee: number;
  readonly currency: PaymentCurrencies;
}
