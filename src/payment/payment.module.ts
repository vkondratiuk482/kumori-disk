import { Module } from '@nestjs/common';
import { PaymentServiceProvider } from './providers/payment-service.provider';

@Module({
  providers: [PaymentServiceProvider],
  exports: [PaymentServiceProvider],
})
export class PaymentModule {}
