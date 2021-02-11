import { registerAs } from '@nestjs/config';
import { ConfigFactory } from '@nestjs/config/dist/interfaces';
import { RedisModuleOptions } from '../redis';

export const redis = registerAs<ConfigFactory<RedisModuleOptions>>(
  'redis',
  () => {
    const redisConfig = process.env.REDIS_CONFIG.split('|');
    const redisHost = redisConfig[0];
    const redisPort = redisConfig[1];

    return {
      ioredis: {
        host: redisHost,
        port: +redisPort,
      },
    };
  }
);
