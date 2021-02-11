import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MAIL_QUEUE } from '@subtitles-translator/constants';

@Injectable()
export class MailService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectQueue(MAIL_QUEUE)
    private readonly mailQueue: Queue
  ) {}
}
