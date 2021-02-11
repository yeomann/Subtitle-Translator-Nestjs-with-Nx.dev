import { Module } from '@nestjs/common';
import { TMSModule } from '../tms';
import { SubtitleHandlerController } from './subtitlehandler.controller';
import { SubtitleHandlerService } from './subtitlehandler.service';

@Module({
  imports: [TMSModule],
  controllers: [SubtitleHandlerController],
  providers: [SubtitleHandlerService],
  exports: [SubtitleHandlerService],
})
export class SubtitleHandlerModule {}
