import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { bootstrap } from '@subtitles-translator/core-modules';
import { AppModule } from './app/app.module';

async function initApp() {
  const app: INestApplication = await NestFactory.create(AppModule);
  bootstrap(
    app,
    'Subtitle Translator App',
    'Rest APIs for Subtitle Translator App'
  );
}

initApp();
