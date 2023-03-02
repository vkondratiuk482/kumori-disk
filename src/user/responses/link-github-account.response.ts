import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LinkGithubAccountResponse {
  @Field()
  public readonly linked: boolean;

  constructor(linked: boolean) {
    this.linked = linked;
  }
}
