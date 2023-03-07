import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmPaymentPlanEntity } from '../entities/typeorm-payment-plan.entity';
import { IPaymentPlanEntity } from '../interfaces/payment-plan-entity.interface';
import { IPaymentPlanRepository } from '../interfaces/payment-plan-repository.interface';

export class TypeOrmPaymentPlanRepository
  implements IPaymentPlanRepository
{
  constructor(
    @InjectRepository(TypeOrmPaymentPlanEntity)
    private readonly paymentPlanRepository: Repository<TypeOrmPaymentPlanEntity>,
  ) {}

  public async findSingleById(id: string): Promise<IPaymentPlanEntity> {
    const paymentPlan = await this.paymentPlanRepository
      .createQueryBuilder('pp')
      .where('id = :id', { id })
      .getOne();

    return paymentPlan;
  }

  public async findAll(): Promise<TypeOrmPaymentPlanEntity[]> {
    const paymentPlans = await this.paymentPlanRepository.find();

    return paymentPlans;
  }
}
