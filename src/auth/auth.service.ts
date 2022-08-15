import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { BCRYPT_SALT_ROUNDS } from './auth.constants';

import { SignIn } from './interfaces/sign-in.interface';
import { CreateUser } from 'src/user/interfaces/create-user.interface';

import { PasswordsNotMatchingError } from './errors/passwords-not-matching.error';

import { User } from 'src/user/user.entity';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async signUp(data: CreateUser): Promise<User> {
    const hashedPassword = await this.encryptString(data.password);

    const createSingleUserData: CreateUser = {
      username: data.username,
      password: hashedPassword,
    };
    const user = await this.userService.createSingle(createSingleUserData);

    return user;
  }

  public async singIn(data: SignIn): Promise<User> {
    const user = await this.userService.findSingleByUsernameWithException(
      data.username,
    );

    const password = data.password;
    const encryptedPassword = user.password;
    const passwordsMatch = await this.compareEncrypted(
      password,
      encryptedPassword,
    );

    return user;
  }

  private async encryptString(data: string): Promise<string> {
    const value = await bcrypt.hash(data, BCRYPT_SALT_ROUNDS);

    return value;
  }

  private async compareEncrypted(
    data: string,
    encrypted: string,
  ): Promise<boolean> {
    const passwordsMatch = await bcrypt.compare(data, encrypted);

    if (!passwordsMatch) {
      throw new PasswordsNotMatchingError();
    }

    return passwordsMatch;
  }
}
