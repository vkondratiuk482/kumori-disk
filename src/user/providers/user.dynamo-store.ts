import { Provider } from '@nestjs/common';
import { DynamoStore } from '@shiftcoders/dynamo-easy';
import { USER_DYNAMO_STORE_TOKEN } from '../constants/user.constants';
import { User } from '../entities/user.entity';

export const UserDynamoStore: Provider = {
  provide: USER_DYNAMO_STORE_TOKEN,
  useValue: new DynamoStore<User>(User),
};
