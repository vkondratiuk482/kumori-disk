import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from './auth.constants';

import { CreateUser } from 'src/user/interfaces/create-user.interface';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async signUp(data: CreateUser): Promise<string> {
    const hashedPassword = await this.hashString(data.password);

    const createSingleUserData: CreateUser = {
      username: data.username,
      password: hashedPassword,
    };
    const { uuid } = await this.userService.createSingle(createSingleUserData);

    return uuid;
  }

  private async hashString(data: string): Promise<string> {
    const value = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);

    return value;
  }
}
