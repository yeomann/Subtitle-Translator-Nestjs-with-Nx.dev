import { LanguageEnum } from '@subtitles-translator/enums';
export interface TranslationJobContainer {
  agentId: string;
  agentEmail: string;
  agentFullname: string;
  containerId: string;
  files?: {
    [key: string]: {
      source: string;
      target: string;
      status: number;
    }[];
  };
  fileName: string[];
  sourceLang: LanguageEnum;
  targetLang: LanguageEnum;
  timeStamp: Date;
}
