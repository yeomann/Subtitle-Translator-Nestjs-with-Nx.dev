import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import {
  bullJobOptions,
  MAIL_PROCESS,
  MAIL_QUEUE,
} from '@subtitles-translator/constants';

@Injectable()
export class TestMailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue
  ) {}

  async sendQueueTest(
    toEmail: string,
    fromEmail: string
  ): Promise<Bull.Job<void>> {
    const jobIdv4 = uuidv4();
    // return this.emailService.sendTestEmail(toEmail, fromEmail);
    try {
      return await this.mailQueue.add(
        MAIL_PROCESS.TEST_QUEUE,
        {
          toEmail,
          fromEmail,
        },
        { ...bullJobOptions, jobId: jobIdv4 }
      );
    } catch (e) {
      this.logger.error('Error occured while sending Test queue');
      this.logger.error(e);
    }
  }
}
