import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathService } from './math.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, MathService],
    }).compile();
  });

  describe('checkHealthCheck', () => {
    it('should return "Translator service is alive!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHealthStatus()).toEqual({
        message: 'Translator service is alive!',
      });
    });
  });
});
