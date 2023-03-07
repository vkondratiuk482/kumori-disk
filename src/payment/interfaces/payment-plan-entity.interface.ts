import { PaymentCurrencies } from '../enums/payment-currencies.enum';

export interface IPaymentPlanEntity {
  id: string;

  charge: number;

  currency: PaymentCurrencies;

  externalId: string;
}
