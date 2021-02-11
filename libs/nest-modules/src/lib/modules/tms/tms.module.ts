import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { TMS } from '../../entities';
import { TMSController } from './tms.controller';
import { TRANSLATE_QUEUE } from '@subtitles-translator/constants';
import { TMSService } from './services/tms.service';
import { TMSTranslateQueueService } from './services/tms.translate.service';
import { TMSTranslateQueueProcessor } from './processor/translate.processor';

@Module({
  imports: [
    // TMS entity typorm definiation
    TypeOrmModule.forFeature([TMS]),
    // Bull Queue defination for translation queue
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: TRANSLATE_QUEUE,
      useFactory: (config: ConfigService) => {
        return {
          redis: config.get('redis.ioredis'),
          name: TRANSLATE_QUEUE,
          // ...config.get('queue'),
        };
      },
    }),
  ],
  controllers: [TMSController],
  providers: [
    // services
    TMSService,
    TMSTranslateQueueService,
    // processor
    TMSTranslateQueueProcessor,
  ],
  exports: [TMSService, TMSTranslateQueueService],
})
export class TMSModule {}
