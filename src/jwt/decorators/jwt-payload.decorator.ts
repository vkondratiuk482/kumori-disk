import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPipe } from '../pipes/jwt.pipe';

export const GetAuhtorizationHeaders = createParamDecorator(
  (_, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return gqlContext.req.headers.authorization;
  },
);

export const IJwtPayloadDecorator = () => GetAuhtorizationHeaders(JwtPipe);
