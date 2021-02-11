import { ErrorMessageEnum } from '@subtitles-translator/enums';
import { ErrorMessage } from '@subtitles-translator/interfaces';
import { requestFromContext } from '@subtitles-translator/utils';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { setValue } from 'express-ctx';
import { ExtractJwt } from 'passport-jwt';
import { AgentsService } from '../agents/agents.service';
import { getClientIp } from 'request-ip';

// for development we can avoid by writing any controller
// or any  method of controller to exclude from asking us the JWT
const excludedPath = [
  'healthcheck',
  'auth/login',
  'auth/changepass',
  'test',
  // 'agents', // for testing leaving the agent open
  // 'agents/upload', // testing upload and don't want to write jwt always
];

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(JwtAuthGuard.name);
  constructor(private readonly agentsService: AgentsService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    if (!request) {
      return true;
    }
    // by pass if one of the requested endpoint should be excluded
    if (excludedPath.some((path) => request.url.includes(path))) {
      return true;
    }
    // Current execution context.
    // Provides access to details about the current request pipeline.
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    this.logger.log('headers accessToken=' + accessToken); // useful during development

    const canActivate = await (super.canActivate(context) as Promise<boolean>);
    // express-ctx context allows to get and set context
    // this is really good as it can given time during your app
    // we can get request context using getValue('req')
    setValue('req', {
      user: request.user,
      ip: getClientIp(request),
      accessToken,
    });
    // further secuity check
    if (canActivate) {
      const agent = await this.agentsService.repo.findOne(request.user.id);

      // log if the request user context contains wrong user ID
      // OR a revoked token
      if (!agent) {
        this.logger.warn({
          user: request.user,
          error: ErrorMessageEnum.WrongUserId,
        });
        throw new UnauthorizedException(
          new ErrorMessage(ErrorMessageEnum.WrongUserId)
        );
      } else if (!agent.accessToken) {
        this.logger.warn({
          user: request.user,
          error: ErrorMessageEnum.RevokedToken,
        });
        throw new UnauthorizedException(
          new ErrorMessage(ErrorMessageEnum.RevokedToken, 'Revoked token')
        );
      }
    }
    return canActivate;
  }

  getRequest(context: ExecutionContext): any {
    return requestFromContext(context);
  }

  handleRequest(err: unknown, user: any): any {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
