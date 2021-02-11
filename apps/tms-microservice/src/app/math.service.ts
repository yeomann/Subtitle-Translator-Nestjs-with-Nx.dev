import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MathService {
  // Create a logger instance
  private logger = new Logger(MathService.name);
  // add array of numbers
  accumulate(numbers: number[]): number {
    const result = (numbers || []).reduce((a, b) => Number(a) + Number(b));
    this.logger.log('Performed accumulatation, Result =' + result);
    return result;
  }
}
