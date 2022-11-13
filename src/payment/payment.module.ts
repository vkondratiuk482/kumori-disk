import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from 'src/cache/cache.module';
import { HttpModule } from 'src/http/http.module';
import { PaymentServiceProvider } from './providers/payment-service.provider';

@Module({
  imports: [ConfigModule, CacheModule, HttpModule],
  providers: [PaymentServiceProvider],
  exports: [PaymentServiceProvider],
})
export class PaymentModule {}
