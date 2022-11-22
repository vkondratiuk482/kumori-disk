import { PaymentPlanEntity } from './payment-plan-entity.interface';

export interface PaymentPlanRepository {
  findAll(): Promise<PaymentPlanEntity[]>;
}
