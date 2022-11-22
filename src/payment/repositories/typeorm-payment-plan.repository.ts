import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmPaymentPlanEntityImplementation } from '../entities/typeorm-payment-plan.entity';
import { PaymentPlanRepository } from '../interfaces/payment-plan-repository.interface';

export class TypeOrmPaymentPlanRepositoryImplementation
  implements PaymentPlanRepository
{
  constructor(
    @InjectRepository(TypeOrmPaymentPlanEntityImplementation)
    private readonly paymentPlanRepository: Repository<TypeOrmPaymentPlanEntityImplementation>,
  ) {}

  public async findAll(): Promise<TypeOrmPaymentPlanEntityImplementation[]> {
    const paymentPlans = await this.paymentPlanRepository.find();

    return paymentPlans;
  }
}
