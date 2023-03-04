export interface GithubSignIn {
  readonly userId: string;

  readonly userGithubId?: string;

  readonly candidateGithubId: number;
}
