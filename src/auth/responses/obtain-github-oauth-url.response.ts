import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ObtainGithubOAuthURLResponse {
  @Field()
  public readonly url: string;

  constructor(url: string) {
    this.url = url;
  }
}
