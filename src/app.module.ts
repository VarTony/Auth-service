import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLoggerModule } from './utility_classes';
import { ScheduleModule } from '@nestjs/schedule';
import { 
  RabbitConnection,
  PostgreConnection,
  RedisConnection
} from '@connections/index';
import {
  AuthModule,
  DomainModule,
  SecretModule,
  TokenModule,
  UserModule,
} from '@entities/index';
import { 
  AMQP_CONFIG,
  REDIS_CONFIG,
  TOKEN_CONFIG,
  POSTGRE_CONFIG
} from '@config/index';

const path = require('path');

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ 
        AMQP_CONFIG,
        REDIS_CONFIG,
        POSTGRE_CONFIG,
        TOKEN_CONFIG
      ],
      envFilePath: [
        path.join(__dirname, '../config/.env'),
        path.join(__dirname, '../config/example.env'),
      ],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PostgreConnection,
    RabbitConnection,
    RedisConnection,
    MyLoggerModule,
    AuthModule,
    TokenModule,
    DomainModule,
    UserModule,
    SecretModule,
  ],
})
export class AppModule {}
