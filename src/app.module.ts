import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AMQPConnection, DbConnection } from '@connections/index';
import {
  AuthModule,
  DomainModule,
  SecretModule,
  TokenModule,
  UserModule,
} from '@entities/index';
import { MyLoggerModule } from './utility_classes';
import { ScheduleModule } from '@nestjs/schedule';
import { AMQPConfig } from './configs/amqp.config';

const path = require('path');

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ AMQPConfig ],
      envFilePath: [
        path.join(__dirname, '../config/.env'),
        path.join(__dirname, '../config/example.env'),
      ],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DbConnection,
    AMQPConnection,
    MyLoggerModule,
    AuthModule,
    TokenModule,
    DomainModule,
    UserModule,
    SecretModule,
  ],
})
export class AppModule {}
