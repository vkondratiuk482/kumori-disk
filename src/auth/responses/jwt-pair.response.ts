import { Field, ObjectType } from '@nestjs/graphql';
import { IJwtPair } from 'src/jwt/interfaces/jwt-pair.interface';

@ObjectType()
export class IJwtPairResponse {
  @Field()
  public readonly accessToken: string;

  @Field()
  public readonly refreshToken: string;

  constructor(pair: IJwtPair) {
    Object.assign(this, pair);
  }
}
