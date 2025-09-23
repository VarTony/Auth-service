import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLoggerModule } from './core';
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
  UserModule
} from '@entities/index';
import { 
  AMQP_CONFIG,
  REDIS_CONFIG,
  TOKEN_CONFIG,
  POSTGRE_CONFIG,
  SECRET_CONFIG
} from '@config/index';
import { CacheModule } from '@nestjs/cache-manager';

const path = require('path');

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      load: [ 
        AMQP_CONFIG,
        REDIS_CONFIG,
        POSTGRE_CONFIG,
        TOKEN_CONFIG,
        SECRET_CONFIG
      ],
      envFilePath: [
        path.join(process.cwd(), 'config/.env'),
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
