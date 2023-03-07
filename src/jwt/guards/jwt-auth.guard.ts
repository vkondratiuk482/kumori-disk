import { GqlExecutionContext } from '@nestjs/graphql';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { JwtTypes } from '../enums/jwt-types.enum';
import { UserService } from 'src/user/user.service';
import { InvalidJwtError } from '../errors/invalid-jwt.error';
import { IJwtService } from '../interfaces/jwt-service.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { InvalidAuthHeadersError } from 'src/auth/errors/invalid-auth-headers.error';
import { AuthorizationHeadersNotProvidedError } from 'src/auth/errors/authorization-headers-not-provided.error';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: IJwtService,
    private readonly userService: UserService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    try {
      const authorizationHeaders = gqlContext.req.headers.authorization;

      const accessToken =
        JwtAuthGuard.extractTokenFromAuthorizationHeaders(authorizationHeaders);

      const payload: IJwtPayload = this.jwtService.verify(
        accessToken,
        JwtTypes.Access,
      );
      const exists = await this.userService.existsById(payload.id);

      return exists;
    } catch (err) {
      if (
        err instanceof InvalidAuthHeadersError ||
        err instanceof InvalidJwtError ||
        err instanceof AuthorizationHeadersNotProvidedError
      ) {
        throw new UnauthorizedException(err.message);
      }

      throw new BadRequestException();
    }
  }

  public static extractTokenFromAuthorizationHeaders(
    authorizationHeaders: string,
  ): string {
    if (!authorizationHeaders) {
      throw new AuthorizationHeadersNotProvidedError();
    }

    const tokenType = authorizationHeaders.split(' ')[0];
    const token = authorizationHeaders.split(' ')[1];

    if (tokenType !== 'Bearer' || !token) {
      throw new InvalidAuthHeadersError();
    }

    return token;
  }
}
