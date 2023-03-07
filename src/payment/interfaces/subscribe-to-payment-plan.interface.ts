import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export interface ISubscribeToPaymentPlan {
  readonly user: IUserEntity;

  readonly paymentPlanId: string;
}
