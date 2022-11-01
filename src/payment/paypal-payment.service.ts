import { Injectable } from '@nestjs/common';
import { PaymentService } from './interfaces/payment-service.interface';

@Injectable()
export class PaypalPaymentServiceImplementation implements PaymentService {
  public async createOrder(): Promise<string> {
    return 'orderId';
  }
}
