import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('checkHealthCheck', () => {
    it('should return "TMS is alive"', () => {
      expect(service.getHealthCheck()).toEqual({
        message: 'TMS is alive',
      });
    });
  });
});
