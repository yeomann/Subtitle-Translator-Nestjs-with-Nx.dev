import { crudGeneralOptions } from '@subtitles-translator/constants';
import { Agent } from '@subtitles-translator/entities';
import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { AgentsService } from './agents.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  AgentUploadReponse,
  ErrorMessage,
  File,
} from '@subtitles-translator/interfaces';
import { ApiMultiFile } from '@subtitles-translator/decorators';
import { txtFileFilter } from '@subtitles-translator/utils';
import { ErrorMessageEnum, LanguageEnum } from '@subtitles-translator/enums';

@Crud({
  ...crudGeneralOptions,
  model: {
    type: Agent,
  },
  query: {
    ...crudGeneralOptions.query,
  },
})
@ApiBearerAuth()
@ApiTags('Agents')
@Controller('agents')
export class AgentsController implements CrudController<Agent> {
  private logger = new Logger(AgentsController.name);
  constructor(public readonly service: AgentsService) {}

  // NOTE: if we are going to production ready then we need to the files
  // to s3 / DB then use QUEUE to fetch the files and do translation
  // with current approach all files are inside the memory which will die for lots of uploads

  /* adding endpoint for recieving the files
   * that user would like to submit for translation
   */
  @Post('upload')
  @ApiOperation({ summary: 'Upload Subtitles txt' })
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('files')
  @UseInterceptors(CrudRequestInterceptor)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: txtFileFilter,
    })
  )
  @ApiQuery({
    name: 'sourceLang',
    enum: LanguageEnum,
    description:
      'Select Source of your files, All files should be same language',
  })
  @ApiQuery({
    name: 'targetLang',
    enum: LanguageEnum,
    description: 'Select what language would you like translation to be?',
  })
  async uploadSubtitlesTXT(
    @Query('sourceLang') sourceLang: LanguageEnum = LanguageEnum.English,
    @Query('targetLang') targetLang: LanguageEnum = LanguageEnum.Dutch,
    @UploadedFiles() files: File[]
  ): Promise<AgentUploadReponse> {
    this.logger.log('Agent conroller is sending Subtitle files to service now');
    // some check as swagger is letting empty file to be sent
    if (files.length === 0) {
      throw new BadRequestException(
        new ErrorMessage(
          ErrorMessageEnum.NoFileProvided,
          'Please provide atleast 1 file to be translated'
        )
      );
    }
    return this.service.handleFiles(files, sourceLang, targetLang);
  }
}
