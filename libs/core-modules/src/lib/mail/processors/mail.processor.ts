import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MAIL_QUEUE, MAIL_PROCESS } from '@subtitles-translator/constants';
import { sendWelcomeAgentMail } from './agent.processor';
import { processTestQueue } from './test.processor';
import { MailQueueLogStatusEnum } from '@subtitles-translator/enums';
import { MailQueueLogService } from '../../mail-queue-log/mail-queue-log.service';
import { sendTranslationsMail } from './translation.processor';

@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailQueueLogService: MailQueueLogService) {}

  @OnQueueActive()
  public async onActive(job: Job): Promise<void> {
    this.logger.debug(`Job ${job.name}:${job.id} started`);
    const { subject, html, to, from, userId } = job.data;
    const numberJobId = String(job.id);
    try {
      const payload = {
        jobId: numberJobId,
        jobProcessName: job.name,
        jobStatus: MailQueueLogStatusEnum.Started,
        emailFrom: from,
        emailTo: to,
        emailHtml: html,
        emailSubject: subject,
        userId: userId || null,
      };
      await this.mailQueueLogService.repo.save(payload);
      this.logger.debug(
        `Mail Queue Log Service onActive() saved for job = ${job.id} for job name = ${job.name}`
      );
    } catch (e) {
      console.log(e);
      this.logger.error(
        `Mail Queue Log Service onActive() FAILED for job = ${job.id} for job name = ${job.name}`
      );
      this.logger.error(e);
    }
  }

  @OnQueueCompleted()
  public async onComplete(job: Job, result: any): Promise<void> {
    this.logger.debug(`Job ${job.name}:${job.id} completed`);
  }

  @OnQueueFailed()
  public async onError(job: Job<any>, error: any): Promise<void> {
    this.logger.error(`Job ${job.name} failed: ${error.message}`, error.stack);
  }

  @Process(MAIL_PROCESS.TEST_QUEUE)
  public handleProcessTestQueue(job: Job): void {
    return processTestQueue(job);
  }

  @Process(MAIL_PROCESS.AGENT.WELCOME)
  public handleWelcomeAgentMail(job: Job): void {
    return sendWelcomeAgentMail(job, this.mailQueueLogService);
  }

  @Process(MAIL_PROCESS.SYSTEM.FINISHED_TRANSLATION)
  public handleSendingTranslationsMail(job: Job): void {
    return sendTranslationsMail(job, this.mailQueueLogService);
  }
}
