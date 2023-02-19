import { Provider } from '@nestjs/common';
import { PAYMENT_CONSTANTS } from '../payment.constant';
import { TypeOrmPaymentPlanRepositoryImplementation } from '../repositories/typeorm-payment-plan.repository';

export const PaymentPlanRepositoryProvider: Provider = {
  useClass: TypeOrmPaymentPlanRepositoryImplementation,
  provide: PAYMENT_CONSTANTS.APPLICATION.PLAN_REPOSITORY_TOKEN,
};
