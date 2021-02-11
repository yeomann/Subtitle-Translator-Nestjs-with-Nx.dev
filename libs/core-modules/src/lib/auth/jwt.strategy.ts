import { Agent } from '@subtitles-translator/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  // we add additianal values that will be avialable in the context automatically
  async validate(payload: Partial<Agent>): Promise<Partial<Agent>> {
    console.log(payload);
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
    };
  }
}
