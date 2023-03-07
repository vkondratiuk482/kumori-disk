import { IPaymentPlanEntity } from './payment-plan-entity.interface';

export interface IPaymentPlanRepository {
  findSingleById(id: string): Promise<IPaymentPlanEntity>;

  findAll(): Promise<IPaymentPlanEntity[]>;
}
