import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from '@connections/index';
import { 
  AuthModule
} from '@entities/index';
import { JwtModule } from '@nestjs/jwt';
import { 
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiration,
  refreshTokenExpiration 
} from '@token/constant';
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
    JwtModule.register({
      global: true,
      secret: accessTokenSecret,
      signOptions: { expiresIn: accessTokenExpiration }
    }),
    DbConnection,
    AuthModule
  ]
})
export class AppModule {}
