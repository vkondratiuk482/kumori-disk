import { PaymentPlanEntity } from './payment-plan-entity.interface';

export interface PaymentPlanRepository {
  findSingleById(id: string): Promise<PaymentPlanEntity>;

  findAll(): Promise<PaymentPlanEntity[]>;
}
