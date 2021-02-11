import { Agent } from '@subtitles-translator/entities';
import { ErrorMessageEnum } from '@subtitles-translator/enums';
import { ErrorMessage } from '@subtitles-translator/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // calles our validateAgent method from the auth service to validate the requesting user
  async validate(username: string, password: string): Promise<Agent> {
    const user = await this.authService.validateAgent(username, password);
    if (!user) {
      throw new UnauthorizedException(
        new ErrorMessage(
          ErrorMessageEnum.WrongUsernameOrPassword,
          'wrong username or password'
        )
      );
    }

    return user;
  }
}
