import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import {
  TRANSLATE_QUEUE,
  TMS_MICROSERVICE_CONFIG,
  TRANSLATE_PROCESS,
} from '@subtitles-translator/constants';
import { TranslationJobContainer } from '@subtitles-translator/interfaces';

@Processor(TRANSLATE_QUEUE)
export class TMSTranslateQueueProcessor {
  private readonly logger = new Logger(this.constructor.name);
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      options: TMS_MICROSERVICE_CONFIG.TCP,
    });
  }

  @OnQueueActive()
  public async onActive(job: Job): Promise<void> {
    this.logger.debug(`Job ${job.name}:${job.id} started`);
  }

  @OnQueueCompleted()
  public async onComplete(job: Job, result: any): Promise<void> {
    this.logger.debug(`Job ${job.name}:${job.id} completed`);
  }

  @OnQueueFailed()
  public async onError(job: Job<any>, error: any): Promise<void> {
    this.logger.error(`Job ${job.name} failed: ${error.message}`, error.stack);
  }

  // queue now should call the TMS microservice to take care of the translation
  // regardless of communication protocol, messanging or event based
  // the syntax definiation is as follows for .send() or .emit()
  // <TResult = any, TInput = any>(pattern: any, data: TInput): Observable<TResult>;
  @Process(TRANSLATE_PROCESS.START_TRANSLATE_QUEUE)
  public async handleProcessTranslateQueue(job: Job): Promise<void> {
    this.logger.log('Queue started Processing for the translation');
    try {
      const { data }: { data: TranslationJobContainer } = job;
      await this.client
        // emit event for translation - <ReturnType, ParamType>(pattern, param)
        .emit<Promise<void>, TranslationJobContainer>('translate_it', data)
        // test math microservice - <ReturnType, ParamType>(pattern, param)
        // .send<number, number[]>('add', [1, 2, 3, 4, 5])
        .toPromise();
    } catch (e) {
      this.logger.error('failed to perform accumulate');
    }
  }
}
