import { UserEntity } from 'src/user/interfaces/user-entity.interface';

export interface SubscribeToPaymentPlan {
  readonly user: UserEntity;

  readonly paymentPlanId: string;
}
