import { Provider } from '@nestjs/common';
import { PAYMENT_CONSTANTS } from '../payment.constant';
import { TypeOrmPaymentPlanRepository } from '../repositories/typeorm-payment-plan.repository';

export const PaymentPlanRepositoryProvider: Provider = {
  useClass: TypeOrmPaymentPlanRepository,
  provide: PAYMENT_CONSTANTS.APPLICATION.PLAN_REPOSITORY_TOKEN,
};
