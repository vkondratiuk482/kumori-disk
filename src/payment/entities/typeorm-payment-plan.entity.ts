import { TypeOrmUserEntityImplementation } from 'src/user/entities/typeorm-user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentCurrencies } from '../enums/payment-currencies.enum';
import { PaymentPlanChargeIntervals } from '../enums/payment-plan-charge-intervals.enum';
import { PaymentPlanEntity } from '../interfaces/payment-plan-entity.interface';

@Entity('payment_plan')
export class TypeOrmPaymentPlanEntityImplementation
  implements PaymentPlanEntity
{
  @PrimaryGeneratedColumn('increment')
  public readonly id: string;

  @Column({ name: 'inverval', type: 'enum', enum: PaymentPlanChargeIntervals })
  public readonly interval: PaymentPlanChargeIntervals;

  @Column({ name: 'charge', type: 'bigint' })
  public readonly charge: number;

  @Column({ name: 'currency', type: 'enum', enum: PaymentCurrencies })
  public readonly currency: PaymentCurrencies;

  @OneToMany(
    () => TypeOrmUserEntityImplementation,
    (user: TypeOrmUserEntityImplementation) => user.plan,
  )
  public users: TypeOrmUserEntityImplementation[];
}
