import { MailQueueLog } from '@subtitles-translator/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailQueueLogService extends TypeOrmCrudService<MailQueueLog> {
  constructor(
    // make repo here public in order to be consume by mail queue
    @InjectRepository(MailQueueLog) public repo: Repository<MailQueueLog>
  ) {
    super(repo);
  }
}
