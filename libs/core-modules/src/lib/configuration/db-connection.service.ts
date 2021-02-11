import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// injectable class in order to be used useClass as TypeOrm Factory options suppose
// credentials coming from seperate class.
// To use this credential class, we must use implementation TypeOrmOptionsFactory on our DB config class
@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  // using configService to ensure that we get .env variables
  // this ensure that there will be no racing condition while we'll for sure
  // recieve our environment variables
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get('database.host'),
      port: parseInt(this.configService.get('database.port')),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      schema: this.configService.get('database.scheme'),
      namingStrategy: new SnakeNamingStrategy(), // some naming strategy for the table columns
      autoLoadEntities: true,
      maxQueryExecutionTime: 1000, // log any query which runs more than 1 second
      keepConnectionAlive: true,
      retryAttempts: 10,
      synchronize: true, // !this.configService.get('isProd'),
      migrationsRun: false,
      // logging: 'all', // enable typeorm logs,
    };
    // logging whole config in order to see the during the initialization of the app
    console.log(config);
    return config;
  }
}
