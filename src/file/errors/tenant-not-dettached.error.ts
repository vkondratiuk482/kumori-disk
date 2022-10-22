export class TenantNotDettachedError extends Error {
  public readonly name: string = 'TenantNotDettached';

  public readonly message: string = `Tenant has not been dettached`;
}
