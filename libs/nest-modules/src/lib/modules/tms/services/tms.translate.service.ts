import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import {
  bullJobOptions,
  TRANSLATE_QUEUE,
  TRANSLATE_PROCESS,
} from '@subtitles-translator/constants';

import { v4 as uuidv4 } from 'uuid';
import { TranslationJobContainer } from '@subtitles-translator/interfaces';

@Injectable()
export class TMSTranslateQueueService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(TRANSLATE_QUEUE)
    private readonly translateQueue: Queue
  ) {}

  // Enqeue translate Job
  async enqueuTranslateJob(
    translationJobContainer: TranslationJobContainer
  ): Promise<Bull.Job<void>> {
    this.logger.log('Enqeue translation request');

    const jobIdv4 = uuidv4();
    try {
      return await this.translateQueue.add(
        TRANSLATE_PROCESS.START_TRANSLATE_QUEUE,
        translationJobContainer,
        {
          ...bullJobOptions,
          jobId: jobIdv4,
        }
      );
    } catch (e) {
      this.logger.error('Error occured while creating "agent-welcome" queue');
      this.logger.error(e);
    }
  }
}
