import { Agent } from '@subtitles-translator/entities';
import { ErrorMessageEnum } from '@subtitles-translator/enums';
import {
  ChangePassRequest,
  ErrorMessage,
  LoginResponse,
  ResetPassRequest,
} from '@subtitles-translator/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly jwtService: JwtService
  ) {}

  // system login endpoint for agent
  async login(agent: Partial<Agent>): Promise<LoginResponse> {
    // before the user loggin in we perform small security check like gmail
    // if this is first time login then we ask for password change
    if (!agent.lastPasswordChange) {
      throw new UnauthorizedException(
        new ErrorMessage(
          ErrorMessageEnum.FirstTimerChangePassword,
          'change password'
        )
      );
    }
    // create payload for saving the agent login info i.e Access token, last password change
    // pyload here we are getting in jwt stragey later which context is saving via Guards
    const payload = {
      id: agent.id,
      username: agent.username,
      lastPasswordChange: agent.lastPasswordChange,
      email: agent.email,
      fullName: agent.fullName,
    };
    agent = new Agent();
    agent.id = payload.id;
    agent.accessToken = this.jwtService.sign(payload); //  creating access token from jwt service
    // saving the agent details via repo.save() method
    agent = await this.agentsService.repo.save(agent);
    // return the newly signed access token along agent info back
    return { ...payload, accessToken: agent.accessToken };
  }

  // system change password endpoint for agent
  async changePassword(data: ChangePassRequest): Promise<LoginResponse> {
    // test if the agent exists in the system
    let agent = await this.validateAgent(data.username, data.password);
    // yes, proceed to save new password
    if (agent) {
      agent.password = data.newPassword;
      agent = await this.agentsService.repo.save(agent);

      return this.login(agent);
    }
    // nope this must be a mistake of username or password
    throw new UnauthorizedException(
      new ErrorMessage(
        ErrorMessageEnum.WrongUsernameOrPassword,
        'wrong username or password'
      )
    );
  }

  // system reset password endpoint for agent
  async resetPassword(data: ResetPassRequest): Promise<LoginResponse> {
    // test if the agent exists in the system
    let agent = await this.agentsService.findOne({
      email: data.username,
    });
    // yes, proceed to reset the password and perform login so can return new Access token directly
    // its good since UX, since user can request to reset from UI and be still validately logged in the system
    // as frontend developer can immediately replace cookies/localStorage with new bearer access token
    if (agent) {
      agent.password = data.newPassword;
      agent = await this.agentsService.repo.save(agent);

      return this.login(agent);
    }
    // nope this must be a mistake of username or password
    throw new UnauthorizedException(
      new ErrorMessage(
        ErrorMessageEnum.WrongUsernameOrPassword,
        'wrong username or password'
      )
    );
  }

  async validateAccessToken(
    headersToken: string,
    username: string
  ): Promise<{ status: string }> {
    // find agent who is requesting
    const agent = await this.agentsService.findOne({
      username,
    });
    // // if the headers and entities access token is same then its OK
    if (agent && agent.accessToken === headersToken) {
      return Promise.resolve({ status: 'LogedIn' });
    }
    // // this is a wrong access token
    throw new UnauthorizedException(
      new ErrorMessage(ErrorMessageEnum.RevokedToken, 'Token is revoked')
    );
  }

  // this method takes username and password goes to agent service first to find user by email
  // later uses bcrypt to compare incoming and encrypred password from the agent entity
  async validateAgent(username: string, password: string): Promise<Agent> {
    // find agent who is requesting
    const agent = await this.agentsService.findOne({
      email: username,
    });
    // decrypt and comapre if the passwords are matching
    if (agent && (await compare(password, agent.password))) {
      return agent;
    }
    // nope you're not my agent
    return null;
  }
}
