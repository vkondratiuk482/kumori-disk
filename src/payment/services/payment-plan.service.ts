import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_PLAN_REPOSITORY_TOKEN } from '../constants/payment.constant';
import { PaymentPlanNotFoundByIdError } from '../errors/payment-plan-not-found.error';
import { PaymentPlanEntity } from '../interfaces/payment-plan-entity.interface';
import { PaymentPlanRepository } from '../interfaces/payment-plan-repository.interface';

@Injectable()
export class PaymentPlanService {
  constructor(
    @Inject(PAYMENT_PLAN_REPOSITORY_TOKEN)
    private readonly paymentPlanRepository: PaymentPlanRepository,
  ) {}

  public async findSingleByIdWithException(
    id: string,
  ): Promise<PaymentPlanEntity> {
    const paymentPlan = await this.paymentPlanRepository.findSingleById(id);

    if (!paymentPlan) {
      throw new PaymentPlanNotFoundByIdError();
    }

    return paymentPlan;
  }

  public async findAll(): Promise<PaymentPlanEntity[]> {
    const paymentPlans = await this.paymentPlanRepository.findAll();

    return paymentPlans;
  }
}
