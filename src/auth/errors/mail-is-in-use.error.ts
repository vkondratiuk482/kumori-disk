export class MailIsInUseError extends Error {
  public readonly name: string = 'MailIsInUse';

  public readonly message: string = 'Mail is already being used';
}
