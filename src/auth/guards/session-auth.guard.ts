import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserService } from '../../user/user.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const uuid = gqlContext.req.session.get('user_uuid');

    const user = await this.userService.findSingleByUuid(uuid);

    if (!user) {
      return false;
    }

    return true;
  }
}
