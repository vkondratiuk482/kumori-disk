import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../user.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const id = gqlContext.req.session.get('user_id');

    const user = await this.userService.findSingleById(id);

    if (!user) {
      return false;
    }

    return true;
  }
}
