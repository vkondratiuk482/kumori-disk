import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResendConfirmationEmailResponse {
  @Field()
  public readonly resent: boolean;

  constructor(resent: boolean) {
    this.resent = resent;
  }
}
