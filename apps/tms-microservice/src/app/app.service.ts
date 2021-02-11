import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // health check
  getHealthCheck(): { message: string } {
    return { message: 'TMS is alive' };
  }
}
