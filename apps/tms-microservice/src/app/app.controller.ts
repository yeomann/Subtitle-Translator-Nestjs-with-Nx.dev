import { Body, Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { TranslationJobContainer } from '@subtitles-translator/interfaces';

import { AppService } from './app.service';
import { MathService } from './math.service';
import { TranslateService } from './translate.service';
@Controller()
export class AppController {
  // Create a logger instance
  private logger = new Logger(AppController.name);

  // Inject services
  constructor(
    private readonly appService: AppService,
    private readonly mathService: MathService,
    private readonly translateService: TranslateService
  ) {}

  @Get('healthcheck')
  getHealthStatus(): {
    message: string;
  } {
    return this.appService.getHealthCheck();
  }

  @MessagePattern('add')
  async accumulate(@Body('data') data: number[]): Promise<number> {
    this.logger.log('Add message Pattern got input as ' + data.toString()); // Log something on every call
    return this.mathService.accumulate(data); // use math service to calc result & return
  }

  // @MessagePattern('translateit')
  @EventPattern('translate_it')
  async handleTranslation(data: TranslationJobContainer): Promise<void> {
    this.logger.log('Translate message Pattern got input'); // Log something on every call
    return this.translateService.performTranslation(data); // use translate service to do black magic
  }
}
