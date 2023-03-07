import { ISubscribeToPaymentPlan } from './subscribe-to-payment-plan.interface';

export interface IPaymentService {
  subscribe(data: ISubscribeToPaymentPlan): Promise<string>;
}
