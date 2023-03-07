import { Inject, Injectable } from '@nestjs/common';
import { PaymentPlanNotFoundByIdError } from '../errors/payment-plan-not-found.error';
import { IPaymentPlanEntity } from '../interfaces/payment-plan-entity.interface';
import { IPaymentPlanRepository } from '../interfaces/payment-plan-repository.interface';
import { PAYMENT_CONSTANTS } from '../payment.constant';

@Injectable()
export class PaymentPlanService {
  constructor(
    @Inject(PAYMENT_CONSTANTS.APPLICATION.PLAN_REPOSITORY_TOKEN)
    private readonly paymentPlanRepository: IPaymentPlanRepository,
  ) {}

  public async findSingleByIdWithException(
    id: string,
  ): Promise<IPaymentPlanEntity> {
    const paymentPlan = await this.paymentPlanRepository.findSingleById(id);

    if (!paymentPlan) {
      throw new PaymentPlanNotFoundByIdError();
    }

    return paymentPlan;
  }

  public async findAll(): Promise<IPaymentPlanEntity[]> {
    const paymentPlans = await this.paymentPlanRepository.findAll();

    return paymentPlans;
  }
}
