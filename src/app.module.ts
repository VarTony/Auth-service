import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from '@connections/index';
import { 
  AuthModule,
  DomainModule,
  ServiceModule,
  TokenModule
} from '@entities/index';
const path = require('path');


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ 
        path.join(__dirname, '../config/.env'), 
        path.join(__dirname, '../config/develop.env') 
    ],
      isGlobal: true
    }),
    DbConnection,
    AuthModule,
    ServiceModule,
    TokenModule,
    DomainModule
  ]
})
export class AppModule {}
