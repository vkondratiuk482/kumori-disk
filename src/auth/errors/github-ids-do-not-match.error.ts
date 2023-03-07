export class GithubIdsDoNotMatchError extends Error {
  public readonly name: string = 'GithubIdsDoNotMatchError';

  public readonly message: string =
    'You are trying to sign in with the wrong Github account';
}
