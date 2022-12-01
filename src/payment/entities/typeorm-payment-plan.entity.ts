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
  public id: string;

  @Column({ name: 'inverval', type: 'enum', enum: PaymentPlanChargeIntervals })
  public interval: PaymentPlanChargeIntervals;

  @Column({ name: 'charge', type: 'bigint' })
  public charge: number;

  @Column({ name: 'currency', type: 'enum', enum: PaymentCurrencies })
  public currency: PaymentCurrencies;

  /**
   * Field that indicates id of a third-party plan (paypal_id, stripe_id and so on)
   */
  @Column({ name: 'external_id', type: 'varchar', nullable: true })
  public externalId: string;

  @OneToMany(
    () => TypeOrmUserEntityImplementation,
    (user: TypeOrmUserEntityImplementation) => user.plan,
  )
  public users: TypeOrmUserEntityImplementation[];
}
