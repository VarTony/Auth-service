import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from '@connections/index';
import { 
  AuthModule,
  DomainModule,
  SecretModule,
  TokenModule,
  UserModule
} from '@entities/index';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Domain } from '@domain/repository';

const path = require('path');


@Module({
  imports: [
    // TypeOrmModule.forFeature([ Domain ]),
    ConfigModule.forRoot({
      envFilePath: [ 
        path.join(__dirname, '../config/.env'), 
        path.join(__dirname, '../config/develop.env') 
    ],
      isGlobal: true
    }),
    DbConnection,
    AuthModule,
    TokenModule,
    DomainModule,
    UserModule,
    SecretModule,
  ]
})
export class AppModule {}
