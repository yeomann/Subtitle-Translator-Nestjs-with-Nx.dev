import { Injectable, Logger } from '@nestjs/common';
import {
  TranslatedFile,
  TranslationJobContainer,
} from '@subtitles-translator/interfaces';
import { TranslateMailService } from '@subtitles-translator/core-modules';
import { TMS, TMSService } from '@subtitles-translator/nest-modules';
import {
  getEnumKeyByEnumValue,
  humanDiffTimestamp,
} from '@subtitles-translator/utils';
import { distance } from 'fastest-levenshtein';
import { LanguageEnum } from '@subtitles-translator/enums';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TranslateService {
  private translatedFilesPath: { folder: string };
  private dataset: {
    data?: TMS[];
    count?: number;
  };
  constructor(
    private readonly tmsService: TMSService,
    private readonly translateMailService: TranslateMailService
  ) {
    // this.createPaginatedFullDatasetBank();
    // this.initDataCache();
    this.translatedFilesPath = { folder: 'assets' };
  }
  // Create a logger instance
  private logger = new Logger(TranslateService.name);
  // add array of numbers
  async performTranslation(job: TranslationJobContainer): Promise<void> {
    const translatedFiles: TranslatedFile[] = [];
    this.logger.log('Ready to perform Levenshtein');
    const initialQueueTime = job.timeStamp;
    const sourceObject = job.files;
    const sourceObjectFileNames = job.fileName;
    const sourceLang = job.sourceLang;
    const targetLang = job.targetLang;
    const userEmail = job.agentEmail;
    const userFullname = job.agentFullname;
    // prepare inital cache bank according to target and source language
    // NOTE: This sort of translating part from dataset is a BIG topic
    // as per talking with Cesar Bretana other day, i assume some Machien learning programing is performing
    // such task to translate line by line or multiple lines at a time.
    // HOWEVER, for this fast prototype i am fetching 10K and assuming that my all dataset is coming a arrray
    //  this is obviosuly not a productio solution just for development only.
    await this.createPaginatedFullDatasetBank(
      { skip: 0, take: 10000 },
      sourceLang,
      targetLang
    ); // we can not do in constructor bcz we want according to target and source lang
    // Perform translation by iterate over each file
    for (let i = 0, len = Object.keys(sourceObject).length; i < len; i++) {
      // send each file seperately
      const translation = await this.translateFile(sourceObject[i]);
      // preparing translated file Object and save it locally to pass it over the mail queue
      const trasnlationObj = {
        filename: `translated-${sourceObjectFileNames[i]}`,
        content: translation.content,
        context: {
          userEmail: userEmail,
          userFullname: userFullname,
          timeStamp: humanDiffTimestamp(
            new Date(initialQueueTime).getTime(),
            new Date().getTime()
          ),
          sourceLang: getEnumKeyByEnumValue(LanguageEnum, sourceLang), // get language full name so UX will be nice for user, we show this in email
          targetLang: getEnumKeyByEnumValue(LanguageEnum, targetLang), // get language full name so UX will be nice for user, we show this in email
        },
      };
      translatedFiles[i] = trasnlationObj;
    }
    //now, we can eneque our translated files to be sent to the requested user
    await this.translateMailService.sendTranslationsEmail(translatedFiles);
    // TODO: // locall dev purpose save in the disk
    this.writeToDisk(translatedFiles);
  }

  // file by file translation attempt
  private async translateFile(
    translateSingleFileArr: {
      source: string;
      target: string;
      status: number;
    }[]
  ): Promise<{ content: string }> {
    const countOfLines = translateSingleFileArr.length;
    this.logger.debug('total number of lines in file:' + countOfLines);

    // Extract the translatable source
    // PLAN: as subtitle have time stamp with closing bracket = ]
    // we need to slice forward from closing braket + space
    // each line is a object
    // line = {
    //   source: "original String",
    //   target: 'this is where translation shoudl come',
    //   status: 0  / 1,
    // };
    for (const line of translateSingleFileArr) {
      const cleanNeedle = this.cleanSentence(line.source); // we clean the sentence by removing id and timestamp from it.

      const translation = this.applySearchLineByLine(cleanNeedle.cleanStr); // sync search of source with local DS

      this.logger.debug('translation got back as: ' + translation);
      // if returned translate is not same as source then change status, because translation was performed
      // example Source = hello world, translation = hello world, we should not update target and status
      if (translation !== line.source) {
        line.target = `${cleanNeedle.initials} ${translation}`;
        line.status = 1;
      }
    }

    // prepare indivisual file for email
    const stringFile = this.prepareTranslatedFile(translateSingleFileArr);

    return {
      content: stringFile,
    };
  }

  // clean single sentence by spliting initail stamp and string to translate
  // example 1 [00:00:12.00 - 00:01:20.00] I am Arwen - I've come to help you.
  // cleaning'll do following
  // 1 - cleanStr: I am Arwen - I've come to help you.
  // 2 - initials: 1 [00:00:12.00 - 00:01:20.00]
  private cleanSentence(
    sentence: string
  ): { cleanStr: string; initials: string } {
    const indexOfLine = sentence.indexOf(']');
    const strToTranslate = sentence.slice(indexOfLine + 1).trim();
    const initials = sentence.slice(0, indexOfLine + 1);
    return {
      cleanStr: strToTranslate,
      initials,
    };
  }

  // search and perfor distance() levenshtein from cached dataset
  private applySearchLineByLine(needle: string) {
    this.logger.debug('searching needle = ' + needle);
    let translatedSentence: string;
    const dataset = this.dataset.data;

    for (const row of dataset) {
      const distanceValue = distance(needle, row.source);
      this.logger.warn(
        'distance of ' + needle + ' ?? ' + row.source + '=' + distanceValue
      );

      if (distanceValue < 5) {
        translatedSentence = row.target; // translation FOUND
        break;
      } else {
        translatedSentence = needle; // translation NOT FOUND
      }
    }
    return translatedSentence;
  }

  // prepare final file that is translated
  // from array to file
  // NOTE: incase of very big array and it would take too much memory to serialize string before writing so we should use streams
  // for now since we are going *NOT* save or write, we can directly write array to Buffer
  //  Nodemailer can take attachement as buffer and send it.
  // BUT buffer are lost into object during Bull Queue,
  // Therefore insteading of converting String to Buffer now, we will do it in mail processor
  private prepareTranslatedFile(
    arrayOfFile: {
      source: string;
      target: string;
      status: number;
    }[]
  ): string {
    let fileStr = '';
    this.logger.log('Preparing buffer of file');
    for (let i = 0, len = arrayOfFile.length; i < len; i++) {
      fileStr += `${arrayOfFile[i].target}\n`;
    }

    return fileStr;
  }

  private writeToDisk(files: TranslatedFile[]) {
    this.logger.log('write to disk started');
    for (let i = 0, len = files.length; i < len; i++) {
      const stream = fs.createWriteStream(
        path.resolve(
          __dirname,
          this.translatedFilesPath.folder,
          files[i].filename
        ),
        {
          encoding: 'utf8',
          flags: 'w',
        }
      );
      stream.once('open', function (fd) {
        stream.write(files[i].content);
        stream.end();
      });
    }
    this.logger.log('write to disk ended');
  }

  private async createPaginatedFullDatasetBank(
    query: {
      take: number;
      skip: number;
    },
    sourceLang: string,
    targetLang: string
  ): Promise<void> {
    // 1 - download all db and save in array to go over with levenshtein
    // 2 - use subset of data full db with pagination, 100 at a time.
    // lets do paginated
    const take = query.take || 2;
    const skip = query.skip || 0;

    const [result, total] = await this.tmsService.repo.findAndCount({
      where: {
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      },
      take,
      skip,
    });

    this.dataset = {
      data: result,
      count: total,
    };
  }

  // private createSubsetDatasetBank(files: [string[]]) {
  //   for(let i=0, len=files.length; i<len; i++) {}
  // }
}
