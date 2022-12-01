import { Provider } from '@nestjs/common';
import { PAYMENT_PLAN_REPOSITORY_TOKEN } from '../constants/payment.constant';
import { TypeOrmPaymentPlanRepositoryImplementation } from '../repositories/typeorm-payment-plan.repository';

export const PaymentPlanRepositoryProvider: Provider = {
  provide: PAYMENT_PLAN_REPOSITORY_TOKEN,
  useClass: TypeOrmPaymentPlanRepositoryImplementation,
};
