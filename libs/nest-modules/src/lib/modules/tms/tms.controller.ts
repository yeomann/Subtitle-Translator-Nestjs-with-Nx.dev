import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { TMS } from '../../entities';
import { TMSService } from './services/tms.service';
import { crudGeneralOptions } from '@subtitles-translator/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Adding CRUD defination with default options
// that we creating in constant lib
@Crud({
  ...crudGeneralOptions,
  model: {
    type: TMS,
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
// declaring auth protection tag for controller and swagger
@ApiBearerAuth()
@ApiTags('Translation Management')
@Controller('tms')
export class TMSController implements CrudController<TMS> {
  // default public instiating of TMS service for CRUD
  constructor(public readonly service: TMSService) {}
}
