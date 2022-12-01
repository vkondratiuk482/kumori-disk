export class PaymentPlanNotFoundByIdError extends Error {
  public readonly name: string = 'PaymentPlanNotFoundById';

  public readonly message: string = 'There is no payment plan under this id';
}
