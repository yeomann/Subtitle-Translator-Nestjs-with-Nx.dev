import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { AgentsModule } from './agents/agents.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseConnectionService } from './configuration/db-connection.service';
import * as CoreConfig from './core-config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailModule } from './mail/mail.module';
import { MailQueueLogModule } from './mail-queue-log/mail-queue-log.module';
import { RedisModule } from './redis';

@Module({
  imports: [
    // Config for the Core modules only
    ConfigModule.forRoot({
      isGlobal: false,
      load: Object.values(CoreConfig),
    }),
    // Add Global Auth for our system
    AuthModule,
    // Adding Postgres with Typeorm
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    // Adding Multer to handle uploads
    // for this case we'll be using memory storage
    MulterModule.register({
      storage: memoryStorage(),
    }),
    // adding our own redis module that bring extra functionalities
    // default nestjs doesn't told us if we are unable to connect to redis
    // thus we have additional methods here to help us with that such as
    // onApplicationShutdown, forRootAsync, forRoot, createAsyncProviders etc
    // This module is actually copy paste from Github after searching on the topic that
    // why nestjs is not notifiying if the redis is connected or not
    // Thus, stumbled upon after reading some source code
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('redis'),
    }),
    // adding queue log module
    MailQueueLogModule,
    // Mail Module
    MailModule,
    // adding module of users aka Agents of the system
    // these will be the people, Who will be using the system
    AgentsModule,
  ],
  controllers: [],
  providers: [
    // adding a gurad on our auth default strategy "jwt"
    // binding to all endpoints globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class CoreModule {}
