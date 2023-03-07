export interface IGithubILocalSignIn {
  readonly userId: string;

  readonly userGithubId?: string;

  readonly candidateGithubId: number;
}
