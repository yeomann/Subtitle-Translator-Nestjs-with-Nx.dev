import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

import { AccumulateDto } from '@subtitles-translator/interfaces';
import { AppService } from './app.service';
import { MathService } from './math.service';

@ApiTags('App')
@Controller('app')
export class AppController {
  // Create a logger instance
  private logger = new Logger(AppController.name);
  // Inject services
  constructor(
    private readonly appService: AppService,
    private readonly mathService: MathService
  ) {}

  @Get('healthcheck')
  getHealthStatus(): { message: string } {
    return this.appService.getHealthCheck();
  }

  // post method to add array of numbers
  @ApiProperty({
    type: [Number],
  })
  @Post('add')
  async accumulate(@Body() data: AccumulateDto): Promise<number> {
    this.logger.log('Post input is ' + data.toString()); // Log something on every call
    return this.mathService.accumulate(data); // use math service to calc result & return
  }
}
