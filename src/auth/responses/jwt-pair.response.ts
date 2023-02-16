import { Field, ObjectType } from '@nestjs/graphql';
import { JwtPair } from 'src/jwt/interfaces/jwt-pair.interface';

@ObjectType()
export class JwtPairResponse {
  @Field()
  public readonly accessToken: string;

  @Field()
  public readonly refreshToken: string;

  constructor(pair: JwtPair) {
    Object.assign(this, pair);
  }
}
