import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailQueueLogService } from './mail-queue-log.service';
import { MailQueueLogController } from './mail-queue-log.controller';
import { MailQueueLog } from '@subtitles-translator/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MailQueueLog])],
  controllers: [MailQueueLogController],
  providers: [MailQueueLogService],
  exports: [MailQueueLogService],
})
export class MailQueueLogModule {}
