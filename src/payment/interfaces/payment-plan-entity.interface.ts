import { PaymentCurrencies } from '../enums/payment-currencies.enum';
import { PaymentPlanChargeIntervals } from '../enums/payment-plan-charge-intervals.enum';

export interface PaymentPlanEntity {
  id: string;

  interval: PaymentPlanChargeIntervals;

  charge: number;

  currency: PaymentCurrencies;

  externalId: string;
}
