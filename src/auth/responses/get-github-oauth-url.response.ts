import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetGithubOAuthURLResponse {
  @Field()
  public readonly url: string;

  constructor(url: string) {
    this.url = url;
  }
}
