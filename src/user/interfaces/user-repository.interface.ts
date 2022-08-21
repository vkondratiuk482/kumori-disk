import { CreateUser } from './create-user.interface';

export interface UserRepositoryInterface<User> {
  findSingleByUuid(uuid: string): Promise<User>;

  findSingleByUsername(username: string): Promise<User>;

  findSingleByEmail(email: string): Promise<User>;

  createSingle(data: CreateUser): Promise<User>;
}
