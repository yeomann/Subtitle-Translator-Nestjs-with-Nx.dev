import {
  Controller,
  // UseInterceptors
} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { crudGeneralOptions } from '@subtitles-translator/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { UsernameAppenderInterceptor } from '@crm-backend/interceptors';
import { MailQueueLog } from '@subtitles-translator/entities';
import { MailQueueLogService } from './mail-queue-log.service';

@Crud({
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  model: {
    type: MailQueueLog,
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
@ApiBearerAuth()
@ApiTags('Mail Queue Log')
@Controller('mail-queue')
export class MailQueueLogController implements CrudController<MailQueueLog> {
  constructor(public readonly service: MailQueueLogService) {}
}
