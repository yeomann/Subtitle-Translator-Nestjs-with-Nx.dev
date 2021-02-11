import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathService } from './math.service';
import { TranslateService } from './translate.service';
import {
  MailModule,
  TranslateMailService,
} from '@subtitles-translator/core-modules';
import { TMSModule } from '@subtitles-translator/nest-modules';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [TMSModule],
      controllers: [AppController],
      providers: [
        AppService,
        MathService,
        TranslateService,
        TranslateMailService,
      ],
    }).compile();
  });

  describe('checkHealthCheck', () => {
    it('should return "TMS is alive"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHealthStatus()).toEqual({
        message: 'TMS is alive',
      });
    });
  });
});
