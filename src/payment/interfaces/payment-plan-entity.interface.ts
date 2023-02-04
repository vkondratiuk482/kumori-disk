import { PaymentCurrencies } from '../enums/payment-currencies.enum';

export interface PaymentPlanEntity {
  id: string;

  charge: number;

  currency: PaymentCurrencies;

  externalId: string;
}
