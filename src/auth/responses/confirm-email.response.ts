import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfirmEmailResponse {
  @Field()
  public readonly confirmed: boolean;

  constructor(confirmed: boolean) {
    this.confirmed = confirmed;
  }
}
