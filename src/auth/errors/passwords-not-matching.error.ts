export class PasswordsNotMatchingError implements Error {
  public readonly name: string = 'PasswordsNotMatching';

  public readonly message: string = 'Passwords not matching';
}
