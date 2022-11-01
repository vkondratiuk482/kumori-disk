import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { PaymentServiceProvider } from './providers/payment-service.provider';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [PaymentServiceProvider],
  exports: [PaymentServiceProvider],
})
export class PaymentModule {}
