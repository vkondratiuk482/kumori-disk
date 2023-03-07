import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IJwtService } from '../interfaces/jwt-service.interface';

@Injectable()
export class JwtPipe implements PipeTransform {
  constructor(
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: IJwtService,
  ) {}

  public async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<IJwtPayload> {
    const accessToken =
      JwtAuthGuard.extractTokenFromAuthorizationHeaders(value);

    const payload: IJwtPayload = await this.jwtService.verify(
      accessToken,
      JwtTypes.Access,
    );

    return payload;
  }
}
