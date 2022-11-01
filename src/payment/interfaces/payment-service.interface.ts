export interface PaymentService {
  createOrder(): Promise<string>;
}
