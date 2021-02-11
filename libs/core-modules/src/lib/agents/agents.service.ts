import { Agent } from '@subtitles-translator/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { AgentUploadReponse, File } from '@subtitles-translator/interfaces';
import { SubtitleHandlerService } from '@subtitles-translator/nest-modules';
import { LanguageEnum } from '@subtitles-translator/enums';
import { AgentMailService } from '../mail/services/mail.agent.service';
// import { AgentMailService } from '@subtitles-translator/core-modules';

@Injectable()
export class AgentsService extends TypeOrmCrudService<Agent> {
  // creating logger
  private readonly logger = new Logger(AgentsService.name);

  // injecting repo as per typeorm crud initialization
  constructor(
    @InjectRepository(Agent) public repo: Repository<Agent>,
    private readonly subtitleHandlerService: SubtitleHandlerService,
    private readonly agentMailService: AgentMailService
  ) {
    super(repo);
  }

  // overrighting the default createOne method of typeorm crud
  async createOne(req: CrudRequest, agent: DeepPartial<Agent>): Promise<Agent> {
    try {
      this.logger.log('Creating new Agent of the system');
      const newAgent = await super.createOne(req, agent);
      // TODO: next will send email, as for a good experince, we can do welcome email for the user of our system
      await this.agentMailService.sendAgentWelcomeEmail(
        newAgent.fullName,
        newAgent.email,
        agent.password
      );
      return newAgent;
    } catch (e) {
      this.logger.error(e);
      this.logger.error('creating new agent');
    }
  }

  // handle uploaded subtitle files
  async handleFiles(
    files: File[],
    sourceLang: LanguageEnum,
    targetLang: LanguageEnum
  ): Promise<AgentUploadReponse> {
    try {
      this.logger.log('Recieved request for Subtitle files');
      return await this.subtitleHandlerService.handleTranslationFiles(
        files,
        sourceLang,
        targetLang
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
