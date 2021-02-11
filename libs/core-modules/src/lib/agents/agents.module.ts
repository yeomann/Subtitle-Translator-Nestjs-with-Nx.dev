import { Agent } from '@subtitles-translator/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentSubscriber } from './agent.subscriber';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { SubtitleHandlerModule } from '@subtitles-translator/nest-modules';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
    SubtitleHandlerModule,
    MailModule,
  ],
  controllers: [AgentsController],
  providers: [AgentsService, AgentSubscriber],
  exports: [AgentsService],
})
export class AgentsModule {}
