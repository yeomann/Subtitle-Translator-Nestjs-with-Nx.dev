import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

// create a logger instance
const logger = new Logger('Main');
// creating config object for create microservice function
const nestApplicationContextOptions: MicroserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 8888,
  },
};
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    nestApplicationContextOptions
  );
  // start the app
  app.listen(() => {
    logger.log('TMS Microservice is Listening');
  });
}

bootstrap();
