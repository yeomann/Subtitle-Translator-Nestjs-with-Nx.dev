import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  config,
  CoreModule,
  MailModule,
} from '@subtitles-translator/core-modules';
import { TMSModule } from '@subtitles-translator/nest-modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathService } from './math.service';
import { TranslateService } from './translate.service';
// import { CoreModule } from '@subtitles-translator/core-modules';
// import { TMSModule } from '@subtitles-translator/nest-modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env',
    }),
    CoreModule,
    MailModule,
    TMSModule,
  ],
  controllers: [AppController],
  providers: [AppService, MathService, TranslateService],
})
export class AppModule {}
