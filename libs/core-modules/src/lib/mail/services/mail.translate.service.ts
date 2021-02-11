import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import {
  bullJobOptions,
  MAIL_PROCESS,
  MAIL_QUEUE,
} from '@subtitles-translator/constants';
import { v4 as uuidv4 } from 'uuid';
import { TranslatedFile } from '@subtitles-translator/interfaces';
import { app } from '../../core-config/app';

@Injectable()
export class TranslateMailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue
  ) {}

  // Enqueue email for agent aka Users uploaded files translation
  // which will be sent as attachments
  async sendTranslationsEmail(
    translatedFile: TranslatedFile[]
  ): Promise<Bull.Job<void>> {
    const jobIdv4 = uuidv4();
    // get system email and add without our pervious context
    const systemAppEmail = app().appEmail;

    const payload = {
      ...translatedFile,
      fromEmail: systemAppEmail,
    };
    this.logger.log('Enqueue a job for send Translations to user');
    try {
      return await this.mailQueue.add(
        MAIL_PROCESS.SYSTEM.FINISHED_TRANSLATION,
        payload,
        {
          ...bullJobOptions,
          jobId: jobIdv4,
        }
      );
    } catch (e) {
      this.logger.error(
        'Error occured while creating "system-end-translating" queue'
      );
      this.logger.error(e);
    }
  }
}
