export class GithubIdNotLinkedError extends Error {
  public readonly name: string = 'GithubIdNotLinked';

  public readonly message: string =
    'You have to link Github Account to your account in order to be able to sign in with Github';
}
