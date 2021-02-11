import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import {
  bullJobOptions,
  MAIL_PROCESS,
  MAIL_QUEUE,
} from '@subtitles-translator/constants';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../../core-config/app';

@Injectable()
export class AgentMailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue
  ) {}

  // when fresh user aka Agent account is created
  async sendAgentWelcomeEmail(
    fullName: string,
    email: string,
    password: string
  ): Promise<Bull.Job<void>> {
    const jobIdv4 = uuidv4();
    // get system email and add without our pervious context
    const systemAppEmail = app().appEmail;

    const payload = { fullName, email, password, fromEmail: systemAppEmail };
    try {
      return await this.mailQueue.add(MAIL_PROCESS.AGENT.WELCOME, payload, {
        ...bullJobOptions,
        jobId: jobIdv4,
      });
    } catch (e) {
      this.logger.error('Error occured while creating "agent-welcome" queue');
      this.logger.error(e);
    }
  }
}
