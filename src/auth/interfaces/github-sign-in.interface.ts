import { UserEntity } from 'src/user/interfaces/user-entity.interface';

export interface GithubSignIn {
  readonly user: UserEntity;

  readonly candidateGithubId: string;
}
