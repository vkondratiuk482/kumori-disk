import { SubscribeToPaymentPlan } from './subscribe-to-payment-plan.interface';

export interface PaymentService {
  subscribe(data: SubscribeToPaymentPlan): Promise<string>;
}
