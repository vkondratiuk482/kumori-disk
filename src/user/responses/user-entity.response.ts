import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';
import { IUserEntity } from '../interfaces/user-entity.interface';

@ObjectType()
export class UserEntityResponse {
  @Field()
  public readonly id: string;

  @Field()
  public readonly email: string;

  @Field()
  public readonly username: string;

  @HideField()
  public readonly password: string;

  @HideField()
  public readonly confirmationStatus: UserConfirmationStatuses;

  @Field()
  public readonly diskSpace: number;

  @HideField()
  public readonly planId: string;

  constructor(entity: IUserEntity) {
    Object.assign(this, entity);
  }
}
