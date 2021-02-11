import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  TranslationJobContainer,
  File,
  AgentUploadReponse,
  ErrorMessage,
} from '@subtitles-translator/interfaces';
import { getValue } from 'express-ctx';
import { v4 as uuidv4 } from 'uuid';
import { TMSTranslateQueueService } from '../tms/services/tms.translate.service';
import { ErrorMessageEnum, LanguageEnum } from '@subtitles-translator/enums';
// import es from 'event-stream'

@Injectable()
export class SubtitleHandlerService {
  // creating logger
  private readonly logger = new Logger(SubtitleHandlerService.name);

  constructor(
    private readonly tmsTranslateQueueService: TMSTranslateQueueService
  ) {}

  // NOTE: two way to read, Bugger or stream
  // BUFFER:
  // 1 - buffer needs to load in memory according to files size which is bad,
  // If you read 10 100MB files, then you allocate 1GB memory just to read 10 files
  // 2 - Especially, it becomes a big problem for a server,
  // given that you do not know how many people are going to use (read file) concurrently
  // StREAM:
  // 1- continuous chunking of data ( it can arguably transmit any number of large files given infinite time)
  // whereas Buffer has limitations in transferring large data
  // 2- no need to wait for the entire resource to load whereas Buffer needs to do buffering (waiting)
  // Other Notes:
  // if large file then fs.ReadFile () <- uses slowerBuffer - len not enough to handle so it dies
  // we need to use streams in that case, fs.createReadableStream(file.txt,) // take some cunk and pass to socket which we can pipe()
  // i.e server.on('connnection', function(socket) { fs.createReadableStream(file.txt,).pipe(socket) })
  // NOTE: in our case it is now a BUFFER due to using Multer
  // thus for this prototype i will be using simple approach of converting buffer to string i.e buffer.string()
  /* This method handle uploaded files for translation
   */
  async handleTranslationFiles(
    files: File[],
    sourceLang: LanguageEnum,
    targetLang: LanguageEnum
  ): Promise<AgentUploadReponse> {
    try {
      this.logger.log('Converting files into translable source array');
      const userContext = getValue('req');
      this.logger.debug('userContext=' + JSON.stringify(userContext));
      const jobIdv4 = uuidv4();
      const jobContainer: TranslationJobContainer = {
        // assing agnet aka user info from context
        agentId: userContext.user.id,
        agentEmail: userContext.user.email,
        agentFullname: userContext.user.fullName,
        // assiging meta data to job container
        containerId: jobIdv4,
        sourceLang: sourceLang,
        targetLang: targetLang,
        timeStamp: new Date(),
        files: {},
        fileName: [],
      };

      // iterate over to prepare array of source line by line strings
      for (let i = 0, len = files.length; i < len; i++) {
        const fileBuffer = files[i].buffer;
        const fileName = files[i].originalname;
        const fileArray = this.bufferStrLinesToArray(fileBuffer);
        jobContainer.files[i] = fileArray;
        jobContainer.fileName[i] = fileName;
      }
      // send job to tranlate
      this.logger.log('Sending source to translation queue');
      const enqueueJob = await this.tmsTranslateQueueService.enqueuTranslateJob(
        jobContainer
      );
      return {
        message: 'Job enqueued successfully',
        queueInfo: {
          id: enqueueJob.id,
          timestamp: enqueueJob.timestamp,
        },
      };
    } catch (e) {
      this.logger.log(e);
      throw new UnauthorizedException(
        new ErrorMessage(
          ErrorMessageEnum.UploadError,
          'Something went wrong while uploading'
        )
      );
    }
  }

  /*
   * Performs Buffer string lines to array conversion
   */
  private bufferStrLinesToArray(
    input: Buffer
  ): { source: string; target: string; status: number }[] {
    const result = [];
    const bs = input.toString('utf8');
    const splittedLines = bs.split(/\r\n|\r|\n/);
    for (let i = 0, len = splittedLines.length; i < len; i++) {
      const obj = {
        source: splittedLines[i],
        target: '',
        status: 0,
      };
      result.push(obj);
    }
    return result;
  }
}
