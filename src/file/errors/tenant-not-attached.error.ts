export class TenantNotAttachedError extends Error {
  public readonly name: string = 'TenantNotAttached';

  public readonly message: string = `Tenant has not been attached`;
}
