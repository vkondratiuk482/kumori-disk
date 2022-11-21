import { SubscribeToPayment } from './subscribe-to-payment.interface';

export interface PaymentService {
  subscribe(data: SubscribeToPayment): Promise<string>;
}
