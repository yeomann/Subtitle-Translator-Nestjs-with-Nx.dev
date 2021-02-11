import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config, CoreModule } from '@subtitles-translator/core-modules';
import { TMSModule } from '@subtitles-translator/nest-modules';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathService } from './math.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env',
    }),
    CoreModule,
    TMSModule,
  ],
  controllers: [AppController],
  providers: [AppService, MathService],
})
export class AppModule {}
