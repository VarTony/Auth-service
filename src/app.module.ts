import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from '@connections/index';
import { 
  AuthModule,
  DomainModule,
  // ServiceModule,
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
    // ServiceModule,
    TokenModule,
    DomainModule,
    UserModule,
  ]
})
export class AppModule {}
