import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './processors';
import {
  AgentMailService,
  TestMailService,
  MailService,
  TranslateMailService,
} from './services';
import { MailController } from './mail.controller';
import { MailQueueLogModule } from '../mail-queue-log/mail-queue-log.module';
import { MAIL_QUEUE } from '@subtitles-translator/constants';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: MAIL_QUEUE,
      useFactory: (config: ConfigService) => {
        return {
          redis: config.get('redis.ioredis'),
          name: MAIL_QUEUE,
          // ...config.get('queue'),
        };
      },
    }),
    MailQueueLogModule,
  ],
  controllers: [MailController],
  providers: [
    // services
    MailService,
    AgentMailService,
    TestMailService,
    TranslateMailService,
    // processors
    MailProcessor,
  ],
  exports: [
    MailService,
    AgentMailService,
    TestMailService,
    TranslateMailService,
  ],
})
export class MailModule {}
