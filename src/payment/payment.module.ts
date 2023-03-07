import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from 'src/cache/cache.module';
import { HttpModule } from 'src/http/http.module';
import { TypeOrmPaymentPlanEntity } from './entities/typeorm-payment-plan.entity';
import { PaymentPlanRepositoryProvider } from './providers/payment-plan-repository.provider';
import { PaymentServiceProvider } from './providers/payment-service.provider';
import { PaymentPlanService } from './services/payment-plan.service';

@Module({
  imports: [
    HttpModule,
    CacheModule,
    TypeOrmModule.forFeature([TypeOrmPaymentPlanEntity]),
  ],
  providers: [
    PaymentPlanService,
    PaymentServiceProvider,
    PaymentPlanRepositoryProvider,
  ],
  exports: [PaymentServiceProvider],
})
export class PaymentModule {}
