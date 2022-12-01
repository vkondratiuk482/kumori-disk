import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { UserEntity } from '../interfaces/user-entity.interface';

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
  public readonly confirmationStatus: UserConfirmationStatus;

  @Field()
  public readonly availableStorageSpaceInBytes: number;

  @HideField()
  public readonly planId: string;

  constructor(entity: UserEntity) {
    Object.assign(this, entity);
  }
}

