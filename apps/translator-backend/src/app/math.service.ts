import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { TMS_MICROSERVICE_CONFIG } from '@subtitles-translator/constants';
import { AccumulateDto } from '@subtitles-translator/interfaces';

@Injectable()
export class MathService {
  private logger = new Logger(MathService.name);
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      options: TMS_MICROSERVICE_CONFIG.TCP,
    });
  }

  accumulate(data: AccumulateDto): Promise<number> {
    this.logger.log('TMS microserive is performing "add" operation');
    try {
      // .send<ReturnType, ParamType>(pattern, param)
      return this.client
        .send<number, number[]>('add', data.numbers)
        .toPromise();
    } catch (e) {
      this.logger.error('failed to perform accumulate');
    }
  }
}
